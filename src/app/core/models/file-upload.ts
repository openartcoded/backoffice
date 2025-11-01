export interface FileUpload {
    id: string;
    contentType: string;
    originalFilename: string;
    name: string;
    size: number;
    creationDate: Date;
    publicResource: boolean;
    correlationId?: string;
    bookmarked: boolean;
    thumb?: boolean;
    thumbnailId?: string;
    transientThumbnail: FileUpload;
}

export interface FileUploadSearchCriteria {
    id?: string;
    correlationId?: string;
    dateBefore?: Date;
    dateAfter?: Date;
    originalFilename?: string;
    publicResource?: boolean;
    bookmarked: boolean;
}
