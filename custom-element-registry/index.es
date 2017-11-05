window.customElements =
  window.customElements
  || {/* microfill */}

new class /* CustomElementRegistry */ {

  constructor () {

    customElements.define
      = this.define.bind (this)

    customElements.upgrade
      = this.upgrade.bind (this)
  }


  define ( name, constructor ) {

    this [name] = constructor

    // https://www.nczonline.net/blog/2010/09/28/why-is-getelementsbytagname-faster-that-queryselectorall
    void

    [].slice
      .call ( document.getElementsByTagName (name) )
      .map  ( this.upgrade, this )
  }


  // https://wiki.whatwg.org/wiki/Custom_Elements#Upgrading
  // "Dmitry's Brain Transplant"
  upgrade (node) {

    // Here's where we can swizzle
    // http://nshipster.com/method-swizzling/
//  new Function ('class extends HTMLElement {}')

    this [node.localName]

    &&

    Object.setPrototypeOf
      (node, this [node.localName].prototype)
        .connectedCallback ()
  }
}

