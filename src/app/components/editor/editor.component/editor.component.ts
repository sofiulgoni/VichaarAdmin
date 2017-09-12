import { Component, ViewChild, OnInit } from '@angular/core';

import { Editor } from '../editor.model/editor.model';

import { FirebaseService } from '../../../services/firebase/firebase.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  @ViewChild('editorModal') editorModal;
  @ViewChild('imageInputCover') imageInputCover;
  @ViewChild('spinner') spinner;

  editorList : any;
  editorListData :any;
  bookList : any;
  bookListData : any;
  languageList : any;
  editor = new Editor();
  books = [];
  book = "";
  editMode = false;

  constructor(private firebase : FirebaseService) { }

  ngOnInit() {
    this.editorList = this.firebase.getEditorList();
    this.editorList.subscribe(editorList => {
      this.editorListData = editorList;
    },error => (console.log(error)));
    this.bookList   = this.firebase.getBookList();
    this.bookList.subscribe(bookList => {
      this.bookListData = bookList;
    },error => (console.log(error)));
    this.languageList = this.firebase.getLanguageList();
  }

  public openEditorDetails(key){
    if(this.editorListData != undefined && this.editorListData.length > 0 && key != undefined){
      this.editor = this.editorListData.find(editor => editor.$key == key);
      this.editMode= true;
      this.editorModal.show();
    }
  }

  public showEditorModal(){
    if(this.editor.name != undefined && this.editor.name != ""){
	  this.editor.editorName = "Gistist";
      this.editorModal.show();
    }
  }

  public hideEditorModal(){
    this.editorModal.hide();
    this.editor = new Editor();
    this.books = [];
    this.book = "";
    this.imageInputCover.nativeElement.value = null;
    this.editMode= false;
  }

  public addBooks(){
    if(this.editMode){
      if(this.book != "" && this.editor.books.indexOf(this.book) == -1){
        this.editor.books.push(this.book);
        this.book = "";
      }
    }else{
      if(this.book != "" && this.books.indexOf(this.book) == -1){
        this.books.push(this.book);
        this.editor.books = this.books;
        this.book = "";
      }
    }
  }

  public deleteBook(key){
    var index = this.editor.books.indexOf(key);
    this.editor.books.splice(index, 1);
  }

  public selectImage(file){
    var extension = file.name.split(".").pop();
    if(extension == 'png' || extension == 'jpg'){
      this.editor.image = file;
    }else{
      alert("Invalid image format");
      this.imageInputCover.nativeElement.value = null;
    }
  }

  public getBookName(key){
    if(this.bookListData !=undefined && this.bookListData.length > 0 && key != undefined){
      return this.bookListData.find(book => book.$key == key).name;
    }else{
      return "";
    }
  }

  public saveEditor(){
    if(this.editor.image != undefined && this.editor.books != undefined && this.editor.books.length > 0){
      this.editor.date = this.getDate();
      this.spinner.show();
      this.firebase.addEditor(this.editor).then(response => {
        console.log(response);
        this.spinner.hide();
        this.hideEditorModal();
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
      });
    }else{
	  alert("All fields required");
	}
  }

  private getDate(){
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var date = year.toString() + month.toString() + day.toString();
    return parseInt(date);
  }

  public updateEditor(){
    if(this.editor.books != undefined && this.editor.books.length > 0){
      this.spinner.show();
      this.firebase.updateEditor(this.editor).then(response => {
        console.log(response);
        this.spinner.hide();
        this.hideEditorModal();
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
      });
    }else{
	  alert("All fields required");
	}
  }

  public deleteEditor(){
    this.spinner.show();
      this.firebase.deleteEditor(this.editor).then(response => {
        console.log(response);
        this.spinner.hide();
        this.hideEditorModal();
      }).catch(error => {
        console.log(error);
        this.spinner.hide();
      });
  }

}
