import { NgModule, enableProdMode  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment.prod';
import { RouterModule, Routes } from "@angular/router";
 
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BookComponent } from './components/book/book.component/book.component';
import { AuthorComponent } from './components/author/author.component/author.component';
import { CategoryComponent } from './components/category/category.component/category.component';
import { LanguageComponent } from './components/language/language.component/language.component';
import { EditorComponent } from './components/editor/editor.component/editor.component';

import { FirebaseService } from './services/firebase/firebase.service';
import { ModalComponent } from './components/modal/modal.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

enableProdMode();

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'book', component: BookComponent },
  { path: 'author', component: AuthorComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'language', component: LanguageComponent },
  { path: 'editor', component: EditorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    AuthorComponent,
    CategoryComponent,
    EditorComponent,
    LoginComponent,
    LanguageComponent,
    ModalComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFireAuthModule,    // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    RouterModule.forRoot(routes)
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
