import JSZip from "jszip";
import { qsp } from "./queryElement";

export const parseContainerXML = async (
  data: JSZip.JSZipObject | null
): Promise<{
  packagePath: string;
  encoding: string;
}> => {
  if (!data) {
    console.error("No container.xml");

    return {
      packagePath: "",
      encoding: "",
    };
  }

  const res = await data?.async("uint8array");
  const t = await new Blob([res], { type: "opf" }).text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(t, "application/xml");

  if (!doc) {
    throw new Error("Container File Not Found");
  }

  const rootfile = doc.querySelector("rootfile");

  if (!rootfile) {
    throw new Error("No RootFile Found");
  }

  const packagePath = rootfile.getAttribute("full-path") || "";
  const encoding =
    doc.querySelector("container")?.getAttribute("xmlEncoding") || "";

  return {
    packagePath,
    encoding,
  };
};

const parseManifest = (node: Element) => {
  const items = node.querySelectorAll("item");
  const manifest: {
    [id: string]: {
      href: string;
      type: string;
      overlay: string;
      properties: string[];
    };
  } = {};

  items.forEach(function (item) {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href") || "";
    const type = item.getAttribute("media-type") || "";
    const overlay = item.getAttribute("media-overlay") || "";
    const properties = item.getAttribute("properties") || "";

    if (id) {
      manifest[id] = {
        href: href,
        type: type,
        overlay: overlay,
        properties: properties.length ? properties.split(" ") : [],
      };
    }
  });

  return manifest;
};

const getElementText = (node: Element, tag: string) => {
  const found = node.getElementsByTagNameNS(
    "http://purl.org/dc/elements/1.1/",
    tag
  );

  if (!found || found.length === 0) return "";

  const el = found[0];

  if (el.childNodes.length) {
    return el.childNodes[0].nodeValue;
  }

  return "";
};

const parseMetadata = (node: Element) => {
  const title = getElementText(node, "title");
  const creator = getElementText(node, "creator");
  const subject = getElementText(node, "subject");
  const description = getElementText(node, "description");

  const publish_at = getElementText(node, "date");

  const publisher = getElementText(node, "publisher");
  const contributor = getElementText(node, "contributor");

  const identifier = getElementText(node, "identifier");
  const language = getElementText(node, "language");
  const rights = getElementText(node, "rights");

  // const modified_date = getPropertyText(node, "dcterms:modified");

  // const layout = getPropertyText(node, "rendition:layout");
  // const orientation = getPropertyText(node, "rendition:orientation");
  // const flow = getPropertyText(node, "rendition:flow");
  // const viewport = getPropertyText(node, "rendition:viewport");
  // const media_active_class = getPropertyText(node, "media:active-class");
  // const spread = getPropertyText(node, "rendition:spread");

  return {
    title,
    creator,
    subject,
    description,
    publisher,
    publish_at,
    contributor,
    identifier,
    language,
    rights,
  };
};

export const parsePackage = async (
  data: JSZip.JSZipObject | null
): Promise<{
  manifest: any;
  navPath: string;
  ncxPath: string;
  coverPath: string;
  // spineNodeIndex: number;
  spine: any[];
  metadata: any;
}> => {
  if (!data) {
    console.error("No content.opf");

    return {
      manifest: {},
      navPath: "",
      ncxPath: "",
      coverPath: "",
      // spineNodeIndex: 0,
      spine: [],
      metadata: {},
    };
  }

  const res = await data?.async("uint8array");
  const t = await new Blob([res], { type: "opf" }).text();
  const parser = new DOMParser();
  const packageDocument = parser.parseFromString(t, "application/xml");

  console.log(
    "🚀 ~ file: parseEpub.ts:159 ~ packageDocument:",
    packageDocument
  );

  if (!packageDocument) {
    throw new Error("Package File Not Found");
  }

  const metadataNode = packageDocument.querySelector("metadata");
  if (!metadataNode) {
    throw new Error("No Metadata Found");
  }

  const manifestNode = packageDocument.querySelector("manifest");
  if (!manifestNode) {
    throw new Error("No Manifest Found");
  }

  const spineNode = packageDocument.querySelector("spine");
  if (!spineNode) {
    throw new Error("No Spine Found");
  }

  const manifest = parseManifest(manifestNode);
  const navPath = findNavPath(manifestNode);
  const ncxPath = findNcxPath(manifestNode, spineNode);
  console.log("%c Line:184 🥐 ncxPath", "color:#33a5ff", ncxPath);
  const coverPath = findCoverPath(packageDocument);

  // this.spineNodeIndex = indexOfElementNode(spineNode);

  const spine = parseSpine(spineNode);

  // this.uniqueIdentifier = this.findUniqueIdentifier(packageDocument);
  const metadata = parseMetadata(metadataNode);

  // this.metadata.direction = spineNode.getAttribute(
  //   "page-progression-direction"
  // );

  return {
    metadata: metadata,
    spine: spine,
    manifest: manifest,
    navPath: navPath,
    ncxPath: ncxPath,
    coverPath: coverPath,
    // spineNodeIndex: this.spineNodeIndex,
  };
};

export const findNcxPath = (manifestNode: Element, spineNode: Element) => {
  // var node = manifestNode.querySelector("item[media-type='application/x-dtbncx+xml']");
  let node = qsp(manifestNode, "item", {
    "media-type": "application/x-dtbncx+xml",
  });
  let tocId;

  // If we can't find the toc by media-type then try to look for id of the item in the spine attributes as
  // according to http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.4.1.2,
  // "The item that describes the NCX must be referenced by the spine toc attribute."
  if (!node) {
    tocId = spineNode.getAttribute("toc");

    if (tocId) {
      // node = manifestNode.querySelector("item[id='" + tocId + "']");
      node = manifestNode.querySelector(`#${tocId}`);
    }
  }

  return node ? node.getAttribute("href") : false;
};

export const findNavPath = (manifestNode: Element) => {
  const node = qsp(manifestNode, "item", { properties: "nav" });

  return node ? node.getAttribute("href") : false;
};

export const parseSpine = (spineNode: Element) => {
  const spine: {
    id: string;
    idref: string;
    linear: string;
    properties: string[];
    index: number;
  }[] = [];

  const selected = spineNode.querySelectorAll("itemref");
  // const items = Array.prototype.slice.call(selected);

  // var epubcfi = new EpubCFI();

  //-- Add to array to maintain ordering and cross reference with manifest
  selected.forEach(function (item: Element, index: number) {
    const idref = item.getAttribute("idref");
    // var cfiBase = epubcfi.generateChapterComponent(spineNodeIndex, index, Id);
    const props = item.getAttribute("properties") || "";
    const propArray = props.length ? props.split(" ") : [];
    // var manifestProps = manifest[Id].properties;
    // var manifestPropArray = manifestProps.length ? manifestProps.split(" ") : [];

    const itemref = {
      id: item.getAttribute("id") || "",
      idref: idref || "",
      linear: item.getAttribute("linear") || "yes",
      properties: propArray || [],
      // "href" : manifest[Id].href,
      // "url" :  manifest[Id].url,
      index: index,
      // "cfiBase" : cfiBase
    };

    spine.push(itemref);
  });

  return spine;
};

export const parseNcx = async (data: JSZip.JSZipObject | null) => {
  if (!data) {
    console.error("No toc.ncx");
  }

  const res = await data?.async("uint8array");
  const t = await new Blob([res], { type: "xml" }).text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(t, "application/xml");

  console.log("🚀 ~ file: parseEpub.ts:289 ~ parseNcx ~ doc:", doc);

  if (!doc) {
    throw new Error("to.ncx Not Found");
  }

  const navPoints = doc.querySelectorAll("navPoint");
  const length = navPoints.length;
  const toc = {};
  const list = [];
  let item, parent;

  // if(!navPoints || length === 0) return list;

  for (let i = 0; i < length; ++i) {
    const current = navPoints[i];
    const id = current.getAttribute("id") || false;
    const content = current.querySelector("content");
    const src = content?.getAttribute("src");
    const navLabel = current.querySelector("navLabel");
    const text = navLabel?.textContent ? navLabel.textContent : "";
    const subitems = [];
    const parentNode = current.parentNode;
    let parent;

    if (
      parentNode &&
      (parentNode.nodeName === "navPoint" ||
        parentNode.nodeName.split(":").slice(-1)[0] === "navPoint")
    ) {
      parent = parentNode?.getAttribute("id");
    }

    item = {
      id: id,
      href: src,
      label: text.trim(),
      subitems: subitems,
      parent: parent,
    };
    
    toc[item.id] = item;

    if (!item.parent) {
      list.push(item);
    } else {
      parent = toc[item.parent];
      parent.subitems.push(item);
    }
  }

  return list;
};

/**
 * Find the Cover Path
 * <item properties="cover-image" id="ci" href="cover.svg" media-type="image/svg+xml" />
 * Fallback for Epub 2.0
 */
export const findCoverPath = (packageDocument: HTMLElement | Document) => {
  const pkg = packageDocument.querySelector("package");
  const epubVersion = pkg?.getAttribute("version");

  // Try parsing cover with epub 3.
  // var node = packageXml.querySelector("item[properties='cover-image']");
  const node = qsp(packageDocument, "item", { properties: "cover-image" });

  if (node) return node.getAttribute("href");

  // Fallback to epub 2.
  const metaCover = qsp(packageDocument, "meta", { name: "cover" });

  if (metaCover) {
    const coverId = metaCover.getAttribute("content");
    const cover = (packageDocument as Document).getElementById(coverId);

    return cover ? cover.getAttribute("href") : "";
  } else {
    return false;
  }
};

export const parseEpub = (data: Blob) => {
  // unzip
  const zip = new JSZip();
  zip
    .loadAsync(data)
    .then((result) => {
      const { files } = result;
      const containerXML = zip.file("META-INF/container.xml");
      console.log("%c Line:8 🍓 files", "color:#6ec1c2", files);

      return parseContainerXML(containerXML);

      // for (const [name, entry] of Object.entries(files)) {
      //   console.log(name, entry.dir);

      // if ()
      // }
    })
    .then(({ packagePath }) => {
      const opf = zip.file(packagePath);

      return parsePackage(opf);
    })
    .then((packaging) => {
      console.log("🚀 ~ file: parseEpub.ts:292 ~ .then ~ package:", packaging);
      const { ncxPath } = packaging;
      const data = zip.file(ncxPath);

      return parseNcx(data);
    }).then(list => {
      console.log("🚀 ~ file: parseEpub.ts:402 ~ .then ~ list:", list)

    });

  // extract cover
  // extract catalog
  // extract
};