import { Component, ViewChild, OnInit } from '@angular/core';

import { FirebaseService } from '../../../services/firebase/firebase.service';

import { Book } from '../book.model/book.model';
import { Content } from '../content.model/content.model';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  @ViewChild('bookModal') bookModal;
  @ViewChild('contentModal') contentModal;
  @ViewChild('imageInput') imageInput;
  @ViewChild('audioInput') audioInput;
  @ViewChild('videoInput') videoInput;
  @ViewChild('spinner') spinner;

  bookList : any;
  bookListData : any;
  authorList : any;
  categoryList : any;
  languageList : any;
  book = new Book();
  readerText = "";
  readerList = [];
  content = new Content();
  contentList = [];
  mediaList = [ {name:"Text", value:1}, {name:"Audio", value:2}, {name:"Video", value:3} ];
  bookEditMode = false;
  contentEditMode = false;
  contentPageCount = 0;

  constructor(private firebase : FirebaseService) { }

  ngOnInit() {
    this.bookList = this.firebase.getBookList();
    this.authorList = this.firebase.getAuthorList();
    this.languageList = this.firebase.getLanguageList();
    this.categoryList = this.firebase.getCategoryList();
    this.bookList.subscribe(bookList => {
      this.bookListData = bookList;
    });
  }

  public openBookDetails(key){
    if(this.bookListData != undefined && this.bookListData.length > 0 && key != undefined){
      this.book = this.bookListData.find(book => book.$key == key);
      this.bookEditMode= true;
      this.bookModal.show();
    }
  }

  public showBookModal(){
    if(this.book.name != undefined && this.book.name != ""){
      this.bookModal.show();
    }
  }

  public hideBookModal(){
    this.bookModal.hide();
    this.book = new Book();
    this.readerText = "";
    this.readerList = [];
    this.clearFileInput();
    this.bookEditMode = false;
    this.contentEditMode = false;
  }

  public showContentModal(){
    if(this.book.image != undefined && this.book.reader != undefined){
      this.bookModal.hide();
      this.contentModal.show();
    }else{
      alert("All fields required");
    }
  }

  public showEditContentModal(){
    this.contentList = this.book.content;
    this.contentEditMode = true;
    this.content = this.book.content[this.contentPageCount];
    this.bookModal.hide();
    this.bookEditMode = false;
    this.contentModal.show();
  }

  public showNextEditContentModal(){
    this.clearFileInput();
    this.book.content[this.contentPageCount] = this.content;
    this.contentPageCount = this.contentPageCount + 1;
    this.content = this.book.content[this.contentPageCount];
  }

  public hideContentModal(){
    this.bookEditMode = false;
    this.contentEditMode = false;
    this.contentModal.hide();
    this.book = new Book();
    this.readerText = "";
    this.readerList = [];
    this.content = new Content();
    this.contentList = [];
    this.clearFileInput();
    this.contentPageCount = 0;
  }

  public addReader(){
    if(this.bookEditMode){
      if(this.readerText != ""){
        this.book.reader.push(this.readerText);
        this.readerText = "";
      }
    }else{
      if(this.readerText != ""){
        this.readerList.push(this.readerText);
        this.book.reader = this.readerList;
        this.readerText = "";
      }
    }
  }

  public deleteReader(item){
    var index = this.book.reader.indexOf(item);
    this.book.reader.splice(index, 1);
  }

  public selectImage(file){
    var extension = file.name.split(".").pop();
    if(extension == 'png' || extension == 'jpg'){
      this.book.image = file;
    }else{
      alert("Invalid image format");
      this.clearFileInput();
    }
  }

  public selectAudio(file){
    var extension = file.name.split(".").pop();
    if(extension == 'mp3'){
      this.content.audio = file;
    }else{
      alert("Invalid audio format");
      this.clearFileInput();
    }
  }

  public selectVideo(file){
    var extension = file.name.split(".").pop();
    if(extension == 'mp4' || extension == '3gp'){
      this.content.video = file;
    }else{
      alert("Invalid video format");
      this.clearFileInput();
    }
  }
  
  public addPages(){
    if( (this.book.media == 1) || (this.book.media == 2 && this.content.audio != undefined) || (this.book.media == 3 && this.content.audio != undefined && this.content.video != undefined)){
      this.content.page = this.contentList.length+1;
      this.contentList.push(this.content);
      this.book.content = this.contentList;
      this.content = new Content();
      this.clearFileInput();
    }else{
      alert("All fields required");
    }
  }

  public saveBook(){
    this.book.hits = 0;
    this.book.date = this.getDate();
    this.spinner.show();
    this.firebase.addBook(this.book).then(book => {
      this.hideContentModal();
      this.spinner.hide();
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  public updateBook(){
    this.spinner.show();
    this.firebase.updateBook(this.book).then(success => {
      console.log(success);
      this.spinner.hide();
	  this.hideBookModal();
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  public updateBookContent(){
    this.spinner.show();
    this.firebase.updateBookContent(this.book, this.content).then(success => {
      console.log(success);
      this.spinner.hide();
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  public deleteBook(){
    this.spinner.show();
    this.firebase.deleteBook(this.book).then(success => {
      console.log(success);
      this.spinner.hide();
	  this.hideBookModal();
    }).catch(error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  private getDate(){
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var date = year.toString() + month.toString() + day.toString();
    return parseInt(date);
  }

  private clearFileInput(){
    if(this.imageInput != undefined){
      this.imageInput.nativeElement.value = null;
    }
    if(this.audioInput != undefined){
      this.audioInput.nativeElement.value = null;
    }
    if(this.videoInput != undefined){
      this.videoInput.nativeElement.value = null;
    }
  }

}
