export interface Error {
    Key: string;
    Description: string;
}

export interface Result<T = void> {
    Success: boolean;
    Errors?: Error[];
    Value?: T;
}

export enum CollectionChangeType {
    Reset = "Reset",
    Remove = "Remove",
    Add = "Add",
    AddAndRemove = "AddAndRemove"
}

export interface CollectionChangedData<T = any> {
    Type: CollectionChangeType;
    NewItems?: T[];
    OldItems?: T[];
}

export interface KeyValueCollectionChangedData<V = any> {
    Type: CollectionChangeType;
    NewItems?: object;
    OldItems?: object;
}

export class Utils {
    private static pad(number) {
        return number < 10 ? '0' + number : number;
    }

    static formatDate(date: Date): string {
        let year = this.pad(date.getFullYear());
        let month = this.pad(date.getMonth() + 1);
        let day = this.pad(date.getDate());
        let hour = this.pad(date.getHours());
        let min = this.pad(date.getMinutes());
        let sec = this.pad(date.getSeconds());
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    }

    private static sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    static bytesToSize(bytes: number) {
        // https://gist.github.com/lanqy/5193417

        if (bytes === 0)
            return 'n/a';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        if (i === 0)
            return `${bytes} ${this.sizes[i]}`;
        else
            return `${(bytes / (1024 ** i)).toFixed(1)} ${this.sizes[i]}`;
    }

    static isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj && !Array.isArray(obj);
    };
}
