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
  // manifest: any;
  // navPath: string;
  // ncxPath: string;
  // coverPath: string;
  // spineNodeIndex: number;
  // spine: any[];
  // metadata: any;
}> => {
  if (!data) {
    console.error("No content.opf");

    return {
      manifest: {},
      navPath: "",
      ncxPath: "",
      coverPath: "",
      spineNodeIndex: 0,
      spine: [],
      metadata: {},
    };
  }

  const res = await data?.async("uint8array");
  const t = await new Blob([res], { type: "opf" }).text();
  const parser = new DOMParser();
  const packageDocument = parser.parseFromString(t, "application/xml");

  // var metadataNode, manifestNode, spineNode;

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
  // const navPath = findNavPath(manifestNode);
  const ncxPath = findNcxPath(manifestNode, spineNode);
  console.log("%c Line:184 🥐 ncxPath", "color:#33a5ff", ncxPath);
  // const coverPath = findCoverPath(packageDocument);

  // this.spineNodeIndex = indexOfElementNode(spineNode);

  // this.spine = this.parseSpine(spineNode, this.manifest);

  // this.uniqueIdentifier = this.findUniqueIdentifier(packageDocument);
  const metadata = parseMetadata(metadataNode);

  // this.metadata.direction = spineNode.getAttribute(
  //   "page-progression-direction"
  // );

  return {
    metadata: metadata,
    // spine: this.spine,
    manifest: manifest,
    // navPath: this.navPath,
    ncxPath: ncxPath,
    // coverPath: this.coverPath,
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
    });

  // extract cover
  // extract catalog
  // extract
};
