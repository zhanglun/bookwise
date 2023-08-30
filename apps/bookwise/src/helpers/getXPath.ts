/**
 * Get absolute xPath position from dom element
 * xPath position will does not contain any id, class or attribute, etc selector
 * Because, Some page use random id and class. This function should ignore that kind problem, so we're not using any selector
 *
 * @param {Element} element element to get position
 * @returns {String} xPath string
 */
export default function getXPath(element: Node): string {
  // Selector
  let selector = '';
  // Loop handler
  let foundRoot;
  // Element handler
  let currentElement = element;

  // Do action until we reach html element
  do {
      // Get element tag name
      const nodeName = currentElement.nodeName.toLowerCase();

      // Get parent element
      const parentElement = currentElement.parentElement;

      // Count children
      if (parentElement.childElementCount > 1) {
          // Get children of parent element
          const parentsChildren = [...parentElement.children];
          // Count current tag
          let tag: HTMLElement[] = [];
          parentsChildren.forEach(child => {
              if (child.nodeName.toLowerCase() === nodeName) tag.push(child) // Append to tag
          })

          // Is only of type
          if (tag.length === 1) {
              // Append tag to selector
              selector = `/${nodeName === '#text' ? 'text()' : nodeName}${selector}`;
          } else {
              // Get position of current element in tag
              const position = tag.indexOf(currentElement) + 1;
              // Append tag to selector
              selector = `/${nodeName === '#text' ? 'text()' : nodeName}[${position}]${selector}`;
          }

      } else {
          //* Current element has no siblings
          // Append tag to selector
          selector = `/${nodeName === '#text' ? 'text()' : nodeName}${selector}`;
      }

      // Set parent element to current element
      currentElement = parentElement;
      // Is root
      foundRoot = parentElement.nodeName.toLowerCase() === 'html';
      // Finish selector if found root element
      if(foundRoot) selector = `/html${selector}`;
  }
  while (foundRoot === false);

  // Return selector
  return selector;
}

//* Example
// const button = document.querySelector("#main > div:nth-child(27) > a.w3-left.w3-btn");
// getXPath(button) // '/html/body/div[7]/div[1]/div[1]/div[4]/a[1]'
