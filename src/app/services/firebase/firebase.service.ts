import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {

  constructor(private auth : AngularFireAuth, private database : AngularFireDatabase) {

   }
   // Authentication Methods.............................................................

   public checkAuthState(){
     return this.auth.auth;
   }

   public login(email, password){
     return this.auth.auth.signInWithEmailAndPassword(email, password);
   }

   public logout(){
     return this.auth.auth.signOut();
   }

   // Language Methods.....................................................................

   public getLanguageList(){
     return this.database.list('/Language');
   }

   public getLanguageByKey(key){
     return this.database.object('/Language/'+key);
   }

   public addLanguage(language){
     this.database.list('/Language').push(language).catch(error => this.errorHandler(error));
   }

   public updateLanguage(language){
     this.database.object('/Language/'+language.$key).update(language).catch(error => this.errorHandler(error));
   }

   // Books Methods.....................................................................

   public getBookList(){
     return this.database.list('/Book');
   }

   public getBookByKey(key){
     return this.database.object('/Book/'+key);
   }

   public addBook(book) {
     var promises = [];
     if(book.media > 1){
       if(book.media > 2){
         return this.uploadImage(book.name, book.image).then(imageURL => {
           console.log("Image Uploaded");
           book.image = imageURL;
           for(var i = 0; i< book.content.length; i++){
             promises.push(this.uploadAudio(book.name, book.content[i].page, book.content[i].audio).then(audioURL => {
               console.log(audioURL.index-1+" Audio Uploaded");
               book.content[audioURL.index-1].audio = audioURL.link;
               promises.push(this.uploadVideo(book.name, book.content[audioURL.index-1].page, book.content[audioURL.index-1].video).then(videoURL => {
                 console.log(videoURL.index-1+" Video Uploaded");
                 book.content[videoURL.index-1].video = videoURL.link;
                 if(videoURL.index == book.content.length){
                   console.log("Video Upload Done");
                   console.log(book);
                   promises.push(this.database.list('/Book').push(book).then(success => {
                     console.log("Book Uploaded");
                     return true;
                   }).catch(error => this.errorHandler(error)));
                 }
               }).catch(error => this.errorHandler(error)));
             }).catch(error => this.errorHandler(error)));
           }
           return Promise.all(promises); 
         }).catch(error => this.errorHandler(error));
       }else{
         return this.uploadImage(book.name, book.image).then(imageURL => {
           console.log("Image Uploaded");
           book.image = imageURL;
           for(var i = 0; i< book.content.length; i++){
             promises.push(this.uploadAudio(book.name, book.content[i].page, book.content[i].audio).then(audioURL => {
               console.log(audioURL.index-1+" Audio Uploaded");
               book.content[audioURL.index-1].audio = audioURL.link;               
               if(audioURL.index == book.content.length){
                 console.log("Audio Upload Done");
                 console.log(book);
                 promises.push(this.database.list('/Book').push(book).then(success => {
                   console.log("Book Uploaded");
                   return true;
                 }).catch(error => this.errorHandler(error)));
               }
             }).catch(error => this.errorHandler(error)));
           }
           return Promise.all(promises);
         }).catch(error => this.errorHandler(error));
       }
     }else{
       return this.uploadImage(book.name, book.image).then(imageURL => {
         book.image = imageURL;
         return this.database.list('/Book').push(book).then(success => {
           console.log("Book Uploaded");
           return true;
         }).catch(error => this.errorHandler(error));
       }).catch(error => this.errorHandler(error));
     }
   }

   public updateBook(book){
     if(typeof book.image == 'object'){
         return this.uploadImage(book.name, book.image).then(imageURL => {
           console.log("Image Updated");
           book.image = imageURL;
           return this.database.object('/Book/'+book.$key).update(book).then(success => {
             console.log("Book Updated");
             return true;
           }).catch(error => this.errorHandler(error));
         }).catch(error => this.errorHandler(error));
       }else{
         return this.database.object('/Book/'+book.$key).update(book).then(success => {
           console.log("Book Updated");
           return true;
         }).catch(error => this.errorHandler(error));
       }
   }

   public updateBookContent(book, content){
     var key = book.$key;
     var name = book.name;
     var index = content.page-1;
     console.log(key+" "+name+" "+index);
     if(content.audio != undefined && typeof content.audio == 'object'){
       return this.uploadAudio(name, content.page, content.audio).then(audioURL => {
         console.log(index+" Audio Uploaded");
         content.audio = audioURL.link;
         if(content.video != undefined && typeof content.video == 'object'){
           return this.uploadVideo(name, content.page, content.video).then(videoURL => {
             console.log(index+" Video Uploaded");
             content.video = videoURL.link;
             return this.database.object('/Book/'+key+'/content/'+index).update(content).then(success => {
               console.log("Content "+index+" Updated");
               return true;
             }).catch(error => this.errorHandler(error));
           }).catch(error => this.errorHandler(error));
         }else{
           return this.database.object('/Book/'+key+'/content/'+index).update(content).then(success => {
             console.log("Content "+index+" Updated");
             return true;
           }).catch(error => this.errorHandler(error));
         }
       }).catch(error => this.errorHandler(error));
     }else{
       if(content.video != undefined && typeof content.video == 'object'){
         return this.uploadVideo(name, content.page, content.video).then(videoURL => {
             console.log(index+" Video Uploaded");
             content.video = videoURL.link;
             return this.database.object('/Book/'+key+'/content/'+index).update(content).then(success => {
               console.log("Content "+index+" Updated");
               return true;
             }).catch(error => this.errorHandler(error));
          }).catch(error => this.errorHandler(error));
       }else{
         return this.database.object('/Book/'+key+'/content/'+index).update(content).then(success => {
           console.log("Content "+index+" Updated");
           return true;
         }).catch(error => this.errorHandler(error));
       }
     }
   }

   public deleteBook(book){
     return this.database.object('/Book/'+book.$key).remove().then(success => {
       return true;
     }).catch(error => this.errorHandler(error));
   }

   // Authors Methods.....................................................................

   public getAuthorList(){
     return this.database.list('/Author');
   }

   public getAuthorByKey(key){
     return this.database.object('/Author/'+key);
   }

   public addAuthor(author){
     this.database.list('/Author').push(author).catch(error => this.errorHandler(error));
   }

   public updateAuthor(author){
     this.database.object('/Author/'+author.$key).update(author).catch(error => this.errorHandler(error));
   }

   // Category Methods.....................................................................

   public getCategoryList(){
     return this.database.list('/Category');
   }

   public getCategoryByKey(key){
     return this.database.object('/Category/'+key);
   }

   public addCategory(category){
     this.database.list('/Category').push(category).catch(error => this.errorHandler(error));
   }

   public updateCategory(category){
     this.database.object('/Category/'+category.$key).update(category).catch(error => this.errorHandler(error));
   }

   // Editor Methods.....................................................................

   public getEditorList(){
     return this.database.list('/Editor');
   }

   public getEditorByKey(key){
     return this.database.object('/Editor/'+key);
   }
   public addEditor(editor){
     return this.uploadImage(editor.name, editor.image).then(imageURL => {
       console.log("Image Uploaded");
       editor.image = imageURL;
       return this.database.list('/Editor').push(editor).then(success => {
         console.log("Data Uploaded");
         return true;
       }).catch(error => this.errorHandler(error));
     }).catch(error => this.errorHandler(error));
   }

   public updateEditor(editor){
     if(typeof editor.image == 'object'){
       return this.uploadImage(editor.name, editor.image).then(imageURL => {
         console.log("Image Updated");
         editor.image = imageURL;
         return this.database.object('/Editor/'+editor.$key).update(editor).then(success => {
           console.log("Data Updated");
           return true;
         }).catch(error => this.errorHandler(error));
       }).catch(error => this.errorHandler(error));
     }else{
       return this.database.object('/Editor/'+editor.$key).update(editor).then(success => {
         console.log("Data Updated");
         return true;
       }).catch(error => this.errorHandler(error));
     }
   }

   public deleteEditor(editor){
     return this.database.object('/Editor/'+editor.$key).remove().then(success => {
       return true;
     }).catch(error => this.errorHandler(error));
   }

   // Uploading Methods.....................................................................

   public uploadImage(name, img){
      return firebase.storage().ref('/Image/'+name).put(img).then(image => {return image.downloadURL}).catch(error => this.errorHandler(error));
   }

   public uploadAudio(name, page, audio){
     return firebase.storage().ref('/Audio/'+name+'/audio'+'-'+page).put(audio).then(audio => {return {index : page, link : audio.downloadURL}}).catch(error => this.errorHandler(error));
   }

   public uploadVideo(name, page, video){
     return firebase.storage().ref('/Video/'+name+'/video'+'-'+page).put(video).then(video => {return {index : page, link : video.downloadURL}}).catch(error => this.errorHandler(error));
   }

   // Error Handler Methods.....................................................................

   public errorHandler(error){
     console.log(error);
     return false;
   }

}
