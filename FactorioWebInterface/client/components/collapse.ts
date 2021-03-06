﻿import "./collapse.ts.less";
import { FlexPanel } from "./flexPanel";
import { HideableContent } from "./hideableContent";
import { BaseElement } from "./baseElement";
import { IBindingSource, ObjectBindingTarget, Binding } from "../utils/binding/module";

let collapseButtonTemplate = document.createElement('template');
collapseButtonTemplate.innerHTML = `
<svg width="100%" viewbox="-50 -50 100 100">  
  <path d="M-25 -43.3 L-25 43.3 L50 0 Z" fill="#363636"/>  
</svg>`;

export class CollapseButton extends HTMLElement {
    constructor() {
        super();

        this.appendChild(collapseButtonTemplate.content.cloneNode(true));
    }
}

customElements.define('a-collapse-button', CollapseButton);

export class Collapse extends BaseElement {
    static readonly bindingKeys = {
        open: {},
        ...BaseElement.bindingKeys
    };

    private _top: FlexPanel;
    private _button: CollapseButton;
    private _contentPresenter: HideableContent;
    private _content: Node;

    constructor(header?: Node | string, content?: Node | string) {
        super();

        let toggler = (event: MouseEvent) => {
            event.stopPropagation();
            this.open = !this.open;
        }

        this._top = new FlexPanel(FlexPanel.classes.horizontal);
        this._top.addEventListener('click', toggler);
        this.appendChild(this._top);

        this._button = new CollapseButton();
        //this._button.addEventListener('click', toggler);
        this._top.appendChild(this._button);

        this._contentPresenter = new HideableContent();
        this.appendChild(this._contentPresenter);

        this.setHeader(header);
        this.setContent(content);
    }

    get open() {
        return typeof this.getAttribute('open') === 'string';
    }

    set open(value: boolean) {
        if (value === this.open) {
            return;
        }

        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }

        this._contentPresenter.open = value;
    }

    get header(): Node {
        let last = this._top.lastChild;

        if (!last.isSameNode(this._button)) {
            return last;
        }

        return undefined;
    }

    setHeader(value: Node | string) {
        let last = this._top.lastChild;
        if (!last.isSameNode(this._button)) {
            this._top.removeChild(last);
        }

        if (value) {
            if (typeof value === 'string') {
                value = document.createTextNode(value);
            }

            this._top.appendChild(value);
        }
    }

    get content(): Node {
        return this._content;
    }

    setContent(value: Node | string) {
        this._contentPresenter.setContent(value);
        return this;
    }

    setOpen(value: boolean): this {
        this.open = value;
        return this;
    }

    bindOpen(source: IBindingSource<boolean>): this {
        let target = new ObjectBindingTarget(this, 'open');
        let binding = new Binding(target, source);

        this.setBinding(Collapse.bindingKeys.open, binding);
        return this;
    }

    get contentPresenter(): HideableContent {
        return this._contentPresenter;
    }
}

customElements.define('a-collapse', Collapse);