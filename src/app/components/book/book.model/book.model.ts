import { Content } from '../content.model/content.model';

export class Book {
    name        : string;
    date        : number;
	hits        : number;
	media       : number;
	type        : number;
	image       : any;
	author      : string;
	category    : string;
	language    : string;
	about       : string;
	description : string;
	reader      : string[];
	content     : Content[];
}
