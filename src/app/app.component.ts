import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('myModal') model: ElementRef | undefined;
  ArticleObj: Article = new Article();
  ArticleList: Article[] = [];
  searchText: string = '';

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    this.ArticleList = JSON.parse(localStorage.getItem("angular") || '[]');
  }

  openModel() {
    if (this.model != null) {
      this.model.nativeElement.style.display = 'block';
    }
  }

  closeModel() {
    this.ArticleObj = new Article();
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
  }

  onDelete(item: Article) {
    const isDelete = confirm("Are you sure you want to Delete?");
    if (isDelete) {
      const currentRecord = this.ArticleList.findIndex(m => m.id === item.id);
      this.ArticleList.splice(currentRecord, 1);
      localStorage.setItem('angular', JSON.stringify(this.ArticleList));
      this.search(); // оновити список після видалення
    }
  }

  onEdit(item: Article) {
    this.ArticleObj = item;
    this.openModel();
  }

  updateArticle() {
    const currentRecord = this.ArticleList.find(m => m.id === this.ArticleObj.id);
    if (currentRecord !== undefined) {
      currentRecord.title = this.ArticleObj.title;
      currentRecord.descriptions = this.ArticleObj.descriptions;
    }
    localStorage.setItem('angular', JSON.stringify(this.ArticleList));
    this.closeModel();
  }

  saveArticle() {
    const isLocalPresent = localStorage.getItem("angular");
    if (isLocalPresent != null) {
      const oldArray = JSON.parse(isLocalPresent);
      this.ArticleObj.id = oldArray.length + 1;
      oldArray.push(this.ArticleObj);
      this.ArticleList = oldArray;
      localStorage.setItem('angular', JSON.stringify(oldArray));
    } else {
      const newArr = [];
      this.ArticleObj.id = 1;
      newArr.push(this.ArticleObj);
      this.ArticleList = newArr;
      localStorage.setItem('angular', JSON.stringify(newArr));
    }
    this.search(); // оновити список після збереження
    this.closeModel();
  }

  search() {
    if (this.searchText.trim() === '') {
      this.loadArticles();
      return;
    }
    this.ArticleList = JSON.parse(localStorage.getItem("angular") || '[]').filter((article: Article) =>
      article.title.toLowerCase().includes(this.searchText.trim().toLowerCase())
    );
  }
}

export class Article {
  id: number;
  title: string;
  descriptions: string;

  constructor() {
    this.id = 0;
    this.title = '';
    this.descriptions = '';
  }
}
