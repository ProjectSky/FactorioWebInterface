﻿import { VirtualComponent } from "../../components/virtualComponent";
import { Collapse } from "../../components/collapse";

export class HelpSectionView extends VirtualComponent {
    constructor() {
        super();

        let content = document.createElement('div');
        HelpSectionView.attachParagrapghs(content, [
            'Select data set from dropdown.',
            'If you are viewing a dataset you will see updates happen live. Changes made here will be sent to running servers.',
            'You will need to refresh the data sets list to see new data sets if they are made.',
            'Click on a row to have the values filled into the form.',
            'If the new value is omitted the key is removed.'
        ]);
        content.classList.add('text');
        content.style.padding = '0 2rem';

        let collapse = new Collapse('Help', content);
        collapse.open = true;
        collapse.classList.add('section');        

        this._root = collapse
    }

    private static attachParagrapghs(parent: Node, paragrapghs: string[]) {
        for (let text of paragrapghs) {
            let p = document.createElement('p');
            p.textContent = text;
            parent.appendChild(p);
        }
    }
}