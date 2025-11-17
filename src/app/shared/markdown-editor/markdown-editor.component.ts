import {
    Component,
    AfterViewInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    OnInit,
} from '@angular/core';
import EasyMDE from 'easymde';

@Component({
    selector: 'app-markdown-editor',
    templateUrl: './markdown-editor.component.html',
    styleUrls: ['./markdown-editor.component.scss'],
    standalone: false,
})
export class MarkdownEditorComponent implements AfterViewInit, OnInit, OnDestroy {
    ngOnInit(): void { }
    @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
    @Input() initialValue: string = '';
    @Output() contentChange = new EventEmitter<string>();

    private easyMDE!: EasyMDE;

    ngAfterViewInit(): void {
        this.easyMDE = new EasyMDE({
            element: this.textarea.nativeElement,
            sideBySideFullscreen: false,
            initialValue: this.initialValue,
            nativeSpellcheck: true,
            autofocus: true,
            minHeight: '50vh',
            hideIcons: ['fullscreen'],
            syncSideBySidePreviewScroll: true,
            imagesPreviewHandler: (src) => {
                return `<img src="${src}" alt="Image preview" style="max-width: 100%;">`;
            },
            spellChecker: true,
        });
        setTimeout(() => {
            EasyMDE.toggleSideBySide(this.easyMDE);
            this.easyMDE.codemirror.refresh();
        }, 200);
        this.easyMDE.codemirror.on('change', () => {
            this.contentChange.emit(this.easyMDE.value());
        });
    }

    ngOnDestroy(): void {
        this.easyMDE.toTextArea();
        this.easyMDE = null!;
    }

    getValue(): string {
        return this.easyMDE.value();
    }

    setValue(value: string) {
        this.easyMDE.value(value);
    }
}
