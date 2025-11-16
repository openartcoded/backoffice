import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from '@core/models/file-upload';
import { Channel, Message, Post } from '@core/models/post';
import { User } from '@core/models/user';
import { FileService } from '@core/service/file.service';
import { ReportService } from '@core/service/report.service';
import { ToastService } from '@core/service/toast.service';
import { IconProp } from '@fortawesome/angular-fontawesome/types';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { firstValueFrom, interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-channel',
    standalone: false,
    templateUrl: './channel.component.html',
    styleUrl: './channel.component.scss',
})
export class ChannelComponent implements OnInit, OnDestroy {
    channel: Channel;
    @Input() user: User;

    @Output()
    onChannelRefreshed: EventEmitter<Channel> = new EventEmitter<Channel>();

    @Input() post: Post;
    @ViewChild('messageContainer') messageContainer: ElementRef;
    @ViewChild('messageInput') messageInput: ElementRef;

    messageForm: FormGroup;
    selectedFiles: File[] = [];
    isSubscribed = false;
    loading = false;
    uploading = false;
    messages: Message[] = [];
    refreshSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private reportService: ReportService,
        private fileService: FileService,
        private toastService: ToastService,
    ) { }

    async ngOnInit() {
        const channel = await firstValueFrom(this.reportService.getChannel(this.post.id));

        for (const msg of channel.messages) {
            if (msg.attachmentIds?.length)
                msg.attachments = await firstValueFrom(this.fileService.findByIds(msg.attachmentIds));
        }
        this.channel = channel;
        this.checkSubscription();
        this.initializeForm();


        if (this.isSubscribed) {
            await this.loadMessages(false);
            this.startAutoRefresh();
            // set to read
            setTimeout(async () => {
                await firstValueFrom(this.reportService.setChannelToRead(this.post.id));
            }, 5000);
        }
    }

    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    initializeForm() {
        this.messageForm = this.formBuilder.group({
            message: ['', [Validators.required, Validators.minLength(1)]],
        });
    }

    checkSubscription() {
        if (this.user && this.channel?.subscribers) {
            this.isSubscribed = this.channel.subscribers.some((sub) => sub === this.user.email);
        }
    }

    async loadMessages(reloadChan = true) {
        if (reloadChan) {
            const channel = await firstValueFrom(this.reportService.getChannel(this.post.id));
            this.onChannelRefreshed.emit(channel);
            for (const msg of channel.messages) {
                if (msg.attachmentIds?.length)
                    msg.attachments = await firstValueFrom(this.fileService.findByIds(msg.attachmentIds));
            }
            this.channel = channel;
        }
        this.messages = this.channel?.messages || [];
        setTimeout(() => this.scrollToBottom(), 100);
    }

    startAutoRefresh() {
        this.refreshSubscription = interval(10000).subscribe(() => {
            this.loadMessages(true);
        });
    }

    async subscribe() {
        this.loading = true;
        try {
            const updatedChannel = await firstValueFrom(this.reportService.subscribe(this.post.id));
            this.channel = updatedChannel;
            this.isSubscribed = true;
            this.toastService.showSuccess('Successfully subscribed to channel');
            await this.loadMessages(false);
            this.startAutoRefresh();
        } catch (error) {
            console.log(error);
            this.toastService.showDanger('Failed to subscribe');
        } finally {
            this.loading = false;
        }
    }

    async sendMessage() {
        if (!this.messageForm.valid) {
            return;
        }

        this.uploading = true;
        const message = this.messageForm.get('message').value || '';

        try {
            const newMessage = await firstValueFrom(
                this.reportService.postMessage(this.post.id, message, this.selectedFiles),
            );
            if (newMessage.attachmentIds?.length) {
                newMessage.attachments = await firstValueFrom(this.fileService.findByIds(newMessage.attachmentIds));
            }
            this.messages.push(newMessage);

            this.messageForm.reset();
            this.selectedFiles = [];
            await this.loadMessages(false);
        } catch (error) {
            console.error(error);
            this.toastService.showDanger('Failed to send message');
        } finally {
            this.uploading = false;
        }
    }

    async deleteMessage(message: Message) {
        if (!confirm('Are you sure you want to delete this message?')) {
            return;
        }

        try {
            console.log(message.id);
            await firstValueFrom(this.reportService.deleteMessage(this.post.id, message.id));
            this.toastService.showSuccess('Message deleted');
            this.channel.messages = this.channel.messages.filter((m) => m.id !== message.id);

            await this.loadMessages(false);
        } catch (error) {
            this.toastService.showDanger('Failed to delete message');
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.selectedFiles = Array.from(input.files);
        }
    }

    removeFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }

    drop($event: NgxFileDropEntry[]) {
        for (const droppedFile of $event) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    this.selectedFiles.push(file);
                });
            }
        }
    }

    scrollToBottom() {
        if (this.messageContainer) {
            this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        }
    }

    isOwnMessage(message: Message): boolean {
        return message.emailFrom && message.emailFrom === this.user?.email;
    }

    formatTimestamp(timestamp: Date): string {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;

        return date.toLocaleDateString();
    }

    downloadAttachment(attachment: FileUpload) {
        this.fileService.download(attachment);
    }

    isImage(attachment: FileUpload): boolean {
        return FileService.isImage(attachment?.contentType);
    }

    isPdf(attachment: FileUpload): boolean {
        return FileService.isPdf(attachment?.contentType);
    }

    getAttachmentIcon(attachment: FileUpload): IconProp {
        if (this.isImage(attachment)) return ['fas', 'file-image'];
        if (this.isPdf(attachment)) return ['fas', 'file-pdf'];
        return ['fas', 'file'];
    }

    handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
}
