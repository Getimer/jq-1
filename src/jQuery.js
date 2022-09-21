window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      elements = [createElement(selectorOrArrayOrTemplate)];
    } else {
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate;
  }
  function createElement(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }
  const api = Object.create(jQuery.prototype);
  Object.assign(api, {
    elements: elements,
    oldApi: selectorOrArrayOrTemplate.oldApi,
  });
  return api;
};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jQuery: true,
  on(eventType, selector, fn) {
    this.elements[0].addEventListener(eventType, (e) => {
      let t = e.target;
      while (!t.matches(selector)) {
        if (this.elements[0] === t) {
          t = null;
          break;
        }
        t = t.parentNode;
      }
      t && fn.call(t, e, t);
    });
    return this.elements;
  },
  get(index) {
    return this.elements[index];
  },
  appendTo(node) {
    if (node instanceof Element) {
      this.each((el) => node.appendChild(el));
    } else if (node.jQuery === true) {
      this.each((el) => node.get(0).appendChild(el));
    }
  },
  append(children) {
    if (children instanceof Element) {
      this.get(0, appendChild(children));
    } else if (children.jQuery === true) {
      children.each((node) => this.get(0).appendChild(node));
    }
  },
  find(selector) {
    let array = [];
    for (let i = 0; i < this.elements.length; i++) {
      array = array.concat(
        Array.from(this.elements[i].querySelectorAll(selector))
      );
    }
    array.oldApi = this;
    return jQuery(array);
  },
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this;
  },
  parent() {
    const array = [];
    this.each((node) => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode);
      }
    });
    return jQuery(array);
  },
  children() {
    const array = [];
    this.each((node) => {
      if (array.indexOf(node.children) === -1) {
        array.push(...node.children);
      }
    });
    return jQuery(array);
  },
  siblings() {
    const array = [];
    this.each((node) => {
      if (array.indexOf(Array.from(node.parentNode.children)) === -1) {
        array.push(
          ...Array.from(node.parentNode.children).filter((n) => n !== node)
        );
      }
    });
    return jQuery(array);
  },
  next() {
    const array = [];
    let x;
    this.each((node) => {
      x = node.nextSibling;
      while (x && x.nodeType === 3) {
        x = x.nextSibling;
        array.push(x);
      }
    });
    return jQuery(array);
  },
  prev() {
    const array = [];
    let x;
    this.each((node) => {
      x = node.previousSibling;
      while (x && x.nodeType === 3) {
        x = x.previousSibling;
        array.push(x);
      }
    });
    return jQuery(array);
  },

  index() {
    const array = [];

    this.each((node) => {
      if (array.indexOf(Array.from(node.parentNode.children)) === -1) {
        array.push(...Array.from(node.parentNode.children));
      }
    });
    let i, j;

    for (i = 0; i < this.elements.length; i++) {
      for (j = 0; j < array.length; j++) {
        if (this.elements[i] === array[j]) {
          j++;
          break;
        }
      }
    }
    return j;
  },
  print() {
    console.log(this.elements);
  },
  addClass(className) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(className);
    }
    return this;
  },
  end() {
    return this.oldApi;
  },
};
