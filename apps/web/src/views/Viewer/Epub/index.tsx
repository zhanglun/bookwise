/* eslint-disable react-hooks/exhaustive-deps */
import ePub, { Book, Contents, EpubCFI, Rendition } from "epubjs";
import { request } from "@/helpers/request.ts";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Toc } from "@/views/Viewer/Epub/Toc.tsx";
import { PageCanvasRef, PageProps } from "@/views/Viewer/Epub/Canvas.tsx";
import { MarkerToolbar, VirtualReference } from "@/components/MarkerToolbar";
import { useBearStore } from "@/store";
import { Mark, TextMark } from "@/helpers/marker/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Marker } from "@/helpers/marker";
import Section from "epubjs/types/section";
import { JSZipObject } from "jszip";
import { accessPageContent, substitute } from "@/helpers/epub";
import Url from "epubjs/types/utils/url";

export interface EpubViewerProps {
	bookId: string;
}

export const EpubViewer = memo(({ bookId }: EpubViewerProps) => {
	const [book, setBook] = useState<Book>();
	const store = useBearStore((state) => ({
		interactiveObject: state.interactiveObject,
		updateInteractiveObject: state.updateInteractiveObject,
	}));
	const [URLCache, setURLCache] = useState<{ [key: string]: string }>({});
	const [files, setFiles] = useState<{ [key: string]: JSZipObject }>({});
  const [activatedMark, setActivatedMark] = useState<Mark | null>(null);
	const [virtualRef, setVirtualRef] = useState<VirtualReference | null>(null);
	const markerRef = useRef<Marker>(Object.create({}));
	const [open, setOpen] = useState<boolean>(false);
	const [notesMap, setNotesMap] = useState<{ [key: number]: Mark[] }>({});
	const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
	const [currentSection, setCurrentSection] = useState<Section>();
	const [content, setContent] = useState<string>("");

	function getEpubBlobs() {
		request
			.get(`books/${bookId}/blobs`, {
				responseType: "blob",
			})
			.then((res) => {
				const bookRes = ePub(res.data);

				console.log("bookRes", bookRes);

				setBook(bookRes);
			});
	}

	function getBookAdditionalInfo() {
		request.get(`books/${bookId}`).then((res) => {
			console.log("%c Line:65 🥐 res", "color:#33a5ff", res);
		});
	}

	function getNotes() {
		request
			.get("/notes", {
				params: {
					filter: [`book_id:eq:${bookId}`, `content:like:要么`],
				},
			})
			.then((res) => {
				const { data: notes } = res;

				notes.forEach((note: Mark) => {
					note.position_metics = JSON.parse(note.position_metics);
					note.style_config = JSON.parse(note.style_config);

					notesMap[note.spine_index] = notesMap[note.spine_index] || [];
					notesMap[note.spine_index].push(note);
				});

				console.log("%c Line:71 🍰 notesMap", "color:#b03734", notesMap);

				setNotesMap({
					...notesMap,
				});
			});
	}

	const display = (item) => {
		const section = book?.spine.get(item);

		if (section) {
			setCurrentSection(section);

			section.load(book.load.bind(book)).then((content) => {
				if (content && content.innerHTML) {
					// @ts-ignore
					const { urls, replacementUrls } = book?.resources;
					const str = substitute(content.innerHTML, urls, replacementUrls);

					setContent(str);
					setCurrentSectionIndex(item);
				}
			});
		}

		return section;
	};

	const [prevLabel, setPrevLabel] = useState("");
	const [nextLabel, setNextLabel] = useState("");

	const nextPage = () => {
		const displayed = display(currentSectionIndex + 1);
	};

	const prevPage = () => {
		const displayed = display(currentSectionIndex - 1);
	};

	useEffect(() => {
		const keyListener = function (e: any) {
			// Left Key
			if ((e.keyCode || e.which) === 37) {
				prevPage();
			}

			// Right Key
			if ((e.keyCode || e.which) === 39) {
				nextPage();
			}
		};

		document.addEventListener("keyup", keyListener, false);

		// const hash = window.location.hash.slice(2);

		return function () {
			document.addEventListener("keyup", keyListener, false);
		};
	}, []);

	useEffect(() => {
		const root = document.getElementById("canvasRoot") as HTMLElement;
		const el = document.getElementById("canvas") as HTMLElement;

		markerRef.current = new Marker(root, el);
	}, []);

	useEffect(() => {
		if (bookId) {
			getNotes();
			getEpubBlobs();
			getBookAdditionalInfo();
		}
	}, [bookId]);

	useEffect(() => {
		if (book) {
			book.opened.then(function () {
				display(currentSectionIndex);
				setCurrentSection(book.spine.get(currentSectionIndex));
			});

			if (book.archived) {
				setFiles(book.archive.zip.files);
				setURLCache(book.archive.urlCache);
			}
		}
	}, [book]);

	function getNavItem(toc, href) {
		for (let i = 0; i < toc.length; i++) {
			const item = toc[i];

			if (item.href === href) {
				return item;
			}

			if (item.subitems && item.subitems.length > 0) {
				return getNavItem(item.subitems, href);
			}
		}
	}

	useEffect(() => {
		console.log("currentSection ===>", currentSection);

		if (currentSection) {
			const prevSection = currentSection.prev();
			const nextSection = currentSection.next();

			console.log("nextSection ==>", nextSection);

			if (nextSection && nextSection.href) {
				const next = getNavItem(book?.navigation.toc, nextSection.href);

				if (next?.label) {
					setNextLabel(`${next.label} »`);
				}
			} else {
				setNextLabel("");
			}

			if (prevSection && prevSection.href) {
				const prev = getNavItem(book?.navigation.toc, prevSection.href);

				if (prev?.label) {
					setPrevLabel(`« ${prev?.label}`);
				}
			} else {
				setPrevLabel("");
			}

			// Add CFI fragment to the history
			//history.pushState({}, '', section.href);
			window.location.hash = "#/" + currentSection.href;
		}
	}, [currentSection]);

	function handleSelectColor(color: string) {
		const config = {
			rectFill: color,
			strokeWidth: 3,
		};


		if (currentSection) {
			const {
				idref: pageId,
				index: spineIndex,
				href: spineName,
			} = currentSection;

		  let mark = activatedMark;

			if (mark) {
				mark.style_config.rectFill = color;
				markerRef.current.updateMark(mark);
			} else {
				mark = markerRef.current.getSelectionRange(document.selection, config, {
					spine_index: parseInt(spineIndex, 10),
					spine_name: spineName,
				});

				if (mark) marker.addMark(mark);
			}

			console.log("%c Line:108 🍖 mark", "color:#e41a6a", mark);

			if (mark) {
				request
					.post("/notes", {
						book_id: parseInt(bookId, 10),
						spine_index: mark.spine_index,
						spine_name: mark.spine_name,
						type: mark.type,
						title: mark.title,
						content: mark.content,
						position_metics: mark.position_metics,
						style_config: mark.style_config,
					})
					.then((res) => {
						console.log("%c Line:123 🌭 res", "color:#42b983", res);
					});
			}
		}

		window?.getSelection()?.removeAllRanges();
	}

	function handleStrokeChange() {}

	useEffect(() => {
		function activeToolbar(event: any) {
			console.log("activeToolbar currentSection", currentSection);

			if (currentSection) {
				const {
					idref: pageId,
					spineIndex,
					spineHref: spineName,
				} = currentSection;

				const selection = window.getSelection();
				let tempMark;

				if (selection) {
					tempMark = markerRef.current.textMarker.createRange(
						selection,
						{ rectFill: "black", lineStroke: "red", strokeWidth: 3 },
						{
							spine_index: spineIndex,
							spine_name: spineName,
						},
					);
					//
					// setVirtualRef({
					// 	getBoundingClientRect: () =>
					// 		selection.getRangeAt(0).getBoundingClientRect(),
					// 	getClientRects: () => selection.getRangeAt(0).getClientRects(),
					// });
					//
					// setOpen(true);
				} else {
					const id = markerRef.current.getMarkIdByPointer(
						event.clientX,
						event.clientY,
					);

					if (id) {
						const mark = markerRef.current.getMark(id);
						console.log("%c Line:206 🥚 mark", "color:#e41a6a", mark);
						const virtualRange =
							markerRef.current.current.getRangeFromMark(mark);

						virtualRange &&
							setVirtualRef({
								getBoundingClientRect: () =>
									virtualRange.getBoundingClientRect(),
								getClientRects: () => virtualRange.getClientRects(),
							});

            setActivatedMark(mark);
						setOpen(true);
					} else {
            setActivatedMark(null);
						setVirtualRef(null);
						setOpen(false);
					}
				}
			}
		}

		document
			.getElementById("book-section")
			?.addEventListener("mouseup", activeToolbar);

		return () => {
			document
				.getElementById("book-section")
				?.removeEventListener("mouseup", activeToolbar);
		};
	}, [currentSection]);

	return (
		<div className={"bg-gray-100"}>
			<div className={"fixed top-0 left-0 bottom-0"}>
				{/* <Toc
          navigation={instance?.navigation}
          metadata={instance?.metadata}
          onItemClick={() => {}}
        /> */}
			</div>
			<div className="relative w-[100vw] px-[60px]" id="canvasRoot">
				<div className="relative max-w-[1028px]">
					<section
						className="py-10 w-full h-full"
						id="book-section"
						dangerouslySetInnerHTML={{ __html: content }}
					/>
					<div
						id="canvas"
						className="absolute right-0 left-0 top-10 bottom-10 pointer-events-none mix-blend-multiply"
					/>
				</div>
				<div className="flex justify-between items-center">
					<span id="prev" className="" onClick={() => prevPage()}>
						{prevLabel}
					</span>
					<span id="next" className="" onClick={() => nextPage()}>
						{nextLabel}
					</span>
				</div>
			</div>
			<MarkerToolbar
				open={open}
				onVirtualRefChange={() => {}}
				virtualRef={virtualRef}
				onStrokeChange={handleStrokeChange}
				onSelectColor={handleSelectColor}
			/>
		</div>
	);
});
