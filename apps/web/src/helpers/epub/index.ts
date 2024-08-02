import { FileFormat } from "@/interface/book";
import JSZip from "jszip";

/**
 * querySelector by property
 * @param {element} el
 * @param {string} sel selector string
 * @param {object[]} props
 * @returns {element[]} elements
 * @memberof Core
 */
export function qsp(
  el: Element | Document,
  sel: string,
  props: { [key: string]: string }
) {
  let q, filtered;

  if (typeof el.querySelector != "undefined") {
    sel += "[";

    for (const prop in props) {
      sel += prop + "~='" + props[prop] + "'";
    }

    sel += "]";

    return el.querySelector(sel);
  } else {
    q = el.getElementsByTagName(sel);

    filtered = Array.prototype.slice.call(q, 0).filter(function (el) {
      for (const prop in props) {
        if (el.getAttribute(prop) === props[prop]) {
          return true;
        }
      }
      return false;
    });

    if (filtered) {
      return filtered[0];
    }
  }
}

export interface BookNavItem {
  href: string;
  url: string;
  ncxId: string;
  label: string;
  parent?: string;
  subitems?: BookNavItem[];
}

export interface SpineItem {
  id: string;
  idref: string;
  properties: Array<string>;
  index: number;
  url: string;
  href: string;
}

export interface BookContainer {
  packagePath: string;
  encoding: string;
}

export interface EpubBaseObject {
  files: { [key: string]: JSZip.JSZipObject };
  container: BookContainer;
  basePath: string;
  packaging: any;
  navigation: BookNavItem[];
}

export interface PackagingMetadataObject {
  title: string;
  creator: string;
  subject: string;
  contributor: string;
  description: string;
  publish_at: string;
  publisher: string;
  identifier: string;
  language: string;
  rights: string;
  modified_date: string;
  layout: string;
  orientation: string;
  flow: string;
  viewport: string;
  spread: string;
}

export interface PackagingObject {
  manifest: BookManifest;
  navPath: string;
  ncxPath: string;
  coverPath: string;
  // spineNodeIndex: number;
  spine: any[];
  metadata: PackagingMetadataObject;
}

export interface EpubObject extends EpubBaseObject, PackagingObject {}

export const parseContainerXML = async (
  data: JSZip.JSZipObject | null
): Promise<BookContainer> => {
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

export interface BookManifest {
  [id: string]: {
    href: string;
    type: string;
    overlay: string;
    properties: string[];
  };
}

const parseManifest = (node: Element): BookManifest => {
  const items = node.querySelectorAll("item");
  const manifest: BookManifest = {};

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

const getElementText = (node: Element, tag: string): string => {
  const found = node.getElementsByTagNameNS(
    "http://purl.org/dc/elements/1.1/",
    tag
  );

  if (!found || found.length === 0) return "";

  const el = found[0];

  if (el.childNodes.length) {
    return el.childNodes[0].nodeValue || "";
  }

  return "";
};

const parseMetadata = (node: Element): PackagingMetadataObject => {
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
  basePath: string,
  data: JSZip.JSZipObject | null
): Promise<PackagingObject> => {
  if (!data) {
    console.error("No content.opf");

    return {
      manifest: {} as BookManifest,
      navPath: "",
      ncxPath: "",
      coverPath: "",
      // spineNodeIndex: 0,
      spine: [],
      metadata: {} as PackagingMetadataObject,
    } as PackagingObject;
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
  const navPath = basePath + findNavPath(manifestNode);
  const ncxPath = basePath + findNcxPath(manifestNode, spineNode);
  console.log("%c Line:184 🥐 ncxPath", "color:#33a5ff", ncxPath);
  const coverPath = basePath + findCoverPath(packageDocument);

  // this.spineNodeIndex = indexOfElementNode(spineNode);

  const spine = parseSpine(spineNode, manifest, basePath);

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
  } as PackagingObject;
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

export const parseSpine = (
  spineNode: Element,
  manifest: BookManifest,
  basePath: string
): SpineItem[] => {
  const spine: SpineItem[] = [];

  const selected = spineNode.querySelectorAll("itemref");
  // const items = Array.prototype.slice.call(selected);

  // var epubcfi = new EpubCFI();

  //-- Add to array to maintain ordering and cross reference with manifest
  selected.forEach(function (item: Element, index: number) {
    const idref = item.getAttribute("idref");
    const manifestItem = manifest[idref];
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
      index: index,
      // "cfiBase" : cfiBase
    } as SpineItem;

    if (manifestItem) {
      itemref.href = manifestItem.href;
      itemref.url = basePath + manifestItem.href;
    }

    spine.push(itemref);
  });

  return spine;
};

export const parseNcx = async (
  basePath: string,
  data: JSZip.JSZipObject | null
): Promise<BookNavItem[]> => {
  if (!data) {
    console.error("No toc.ncx");

    return [];
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
  const toc: { [key: string]: BookNavItem } = {};
  const list = [];
  let item;

  // if(!navPoints || length === 0) return list;

  for (let i = 0; i < length; ++i) {
    const current = navPoints[i];
    const ncxId = current.getAttribute("id") || "";
    const content = current.querySelector("content");
    const href = content?.getAttribute("src");
    const url = basePath + (href || "");
    const navLabel = current.querySelector("navLabel");
    const text = navLabel?.textContent ? navLabel.textContent : "";
    const subitems: BookNavItem[] = [];
    const parentNode = current.parentNode;
    let parent: BookNavItem;
    let parentId = "";

    if (
      parentNode &&
      (parentNode.nodeName === "navPoint" ||
        parentNode.nodeName.split(":").slice(-1)[0] === "navPoint")
    ) {
      parentId = (parentNode as Element)?.getAttribute("id") || "";
    }

    item = {
      ncxId: ncxId,
      href,
      url,
      label: text.trim(),
      subitems: subitems,
      parent: parentId,
    };

    toc[item.ncxId] = item;

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

export const parseEpub = async (bookBlob: Blob): Promise<EpubObject> => {
  // unzip
  const zip = new JSZip();
  const result = await zip.loadAsync(bookBlob);
  const { files }: { files: { [key: string]: JSZip.JSZipObject } } = result;
  const containerXML = zip.file("META-INF/container.xml");
  const container = await parseContainerXML(containerXML);
  console.log("🚀 ~ file: parseEpub.ts:405 ~ container:", container);

  const opf = await zip.file(container.packagePath);
  const basePath = container.packagePath.substring(
    0,
    container.packagePath.lastIndexOf("/") + 1
  );
  const packaging = await parsePackage(basePath, opf);

  console.log("🚀 ~ file: parseEpub.ts:292 ~ .then ~ package:", packaging);

  const { ncxPath } = packaging;
  const ncx = await zip.file(ncxPath);
  const navigation = await parseNcx(basePath, ncx);

  return { files, container, basePath, packaging, navigation, ...packaging };
};

export const accessFileContent = async (
  file: JSZip.JSZipObject,
  type?: string
) => {
  const unit8 = await file.async("uint8array");
  const blob = await new Blob([unit8], { type: type || "text" }).text();

  return blob;
};

export const accessImage = async (
  file: JSZip.JSZipObject,
  type: string
): Promise<Blob> => {
  const unit8 = await file.async("uint8array");
  return new Blob([unit8], { type });
};

export const accessPageContent = async (
  file: JSZip.JSZipObject
): Promise<HTMLElement | null> => {
  const xml = await accessFileContent(file, "text/html");
  const parser = new DOMParser();
  const content = parser.parseFromString(xml, "application/xhtml+xml");
  const body = content.querySelector("body");

  return Promise.resolve(body);
};

export function substitute(
  content: string,
  urls: string[],
  replacements: string[]
) {
  console.time("substitute");
  const urlMap = new Map<string, string>();
  const regexUrls: string[] = [];

  urls.forEach((url, i) => {
    if (url && replacements[i]) {
      const escapedUrl = url.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      urlMap.set(url, replacements[i]);
      regexUrls.push(escapedUrl);
    }
  });

  console.log("🚀 ~ urls.forEach ~ urlMap:", urlMap)

  const regex = new RegExp(`([^"]*?)?(${regexUrls.join("|")})`, "g");
  let result = content.replace(regex, (match, prefix, url) => {
    console.log("🚀 ~ result ~ match:", match)
    console.log("🚀 ~ result ~ url:", url)
    console.log("🚀 ~ result ~ prefix:", prefix)
    const replacement = urlMap.get(url);
    console.log("🚀 ~ result ~ replacement:", replacement)
    return replacement;
  });

  console.timeEnd("substitute");

  return result;
}

export function getFileFormatType(
  file: File
): (typeof FileFormat)[keyof typeof FileFormat] {
  const mimeType = file.type;
  const formatTypes: {
    [type: string]: (typeof FileFormat)[keyof typeof FileFormat];
  } = {
    "application/pdf": FileFormat.PDF,
    "application/epub+zip": FileFormat.PDF,
  };

  for (const key in formatTypes) {
    if (mimeType.startsWith(key)) {
      return formatTypes[key];
    }
  }

  return FileFormat.UNKNOWN;
}
