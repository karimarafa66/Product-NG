import { CurrentIndexService } from './../current-index.service';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { DataService } from '../data.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [
    trigger('animate', [
      state(
        'start',
        style({
          animation: 'bounce',
          'animation-duration': '2s',
        })
      ),
      state(
        'end',
        style({
          animation: 'bounce',
          'animation-duration': '2s',
        })
      ),
      state(
        'startRight',
        style({
          animation: 'rollOut',
          'animation-duration': '1s',
        })
      ),
      state(
        'endRight',
        style({
          animation: 'rollOut',
          'animation-duration': '1s',
        })
      ),
      state(
        'startLeft',
        style({
          animation: 'rollIn',
          'animation-duration': '1s',
        })
      ),
      state(
        'endLeft',
        style({
          animation: 'rollIn',
          'animation-duration': '1s',
        })
      ),
      transition('start => end', animate('500ms')),
      transition('end => start', animate('0ms')),
      transition('startRight => endRight', animate('500ms')),
      transition('endRight => startRight', animate('0ms')),
      transition('startLeft => endLeft', animate('500ms')),
      transition('endLeft => startLeft', animate('0ms')),
    ]),
  ],
})
export class ProductComponent implements OnInit, DoCheck, AfterViewChecked {
  @Output() dataEvent = new EventEmitter<any>();

  hammer: HammerManager | undefined;
  imgs = this._DataService.getImages();
  data: any;
  currentIndex = 0;
  reloadCarousel = false;
  private viewChanged = false;
  animationState: any;
  animationStateSwap: any;

  constructor(
    private _DataService: DataService,
    private _CurrentIndexService: CurrentIndexService,
    private cdr: ChangeDetectorRef
  ) {}

  // Method to trigger the reload
  triggerReload() {
    this.reloadCarousel = true;
    setTimeout(() => {
      this.reloadCarousel = false;
    }, 0); // This delay ensures that the component is re-rendered
  }
  ngAfterViewChecked() {
    if (this.viewChanged) {
      this.viewChanged = false;
      this.imgs = this._DataService.getImages();
      this.cdr.detectChanges();
      this.triggerReload();
    }
  }

  checkViewChanges() {
    this.viewChanged = true;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this._CurrentIndexService.getCurrentIndex().subscribe(() => {
      this.checkViewChanges();
    });
    this._DataService.readJsonFile().subscribe((data) => {
      this.data = data;
      this.dataEvent.emit(data);
      this._CurrentIndexService.updateCurrentLength(data.legnth);
      this._DataService.updateImages(data[0].colors[0].images);
      this.imgs = this._DataService.getImages();

      this._DataService.updateVideoKey(data[0].video.split('=')[1]);
      // this.imgs.next(this._DataService.getImages())
      console.log(data);
    });
    this.hammer = new Hammer(document.body);
    this.hammer.on('swiperight', () => this.swipeRight());
    this.hammer.on('swipeleft', () => this.swipeLeft());
  }
  swipeRight() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this._CurrentIndexService.updateCurrentIndex(this.currentIndex);
      this._DataService.updateImages(
        this.data[this.currentIndex].colors[0].images
      );
      this._DataService.updateVideoKey(
        this.data[this.currentIndex].video.split('=')[1]
      );

      this.imgs = this._DataService.getImages();
      // this.imgs.next(this._DataService.getImages())

      this.startAnimationRight();
      this.triggerReload();
    }
  }

  // Method to handle swipe left
  swipeLeft() {
    if (this.currentIndex < this.data.length - 1) {
      this.currentIndex++;
      this._CurrentIndexService.updateCurrentIndex(this.currentIndex);
      this._DataService.updateImages(
        this.data[this.currentIndex].colors[0].images
      );
      this._DataService.updateVideoKey(
        this.data[this.currentIndex].video.split('=')[1]
      );
      console.log(this._DataService.getVideoKey());

      this.imgs = this._DataService.getImages();
      this.startAnimationLeft();

      this.triggerReload();
    }
  }

  startAnimationRight() {
    this.animationState = 'startRight';
    if (this.animationState == 'startRight') {
      this.animationState = 'endRight';
    } else if (this.animationState == 'endRight') {
      this.animationState = 'startRight';
    }
    console.log(this.animationState + 'animationStateSwap');
  }
  startAnimationLeft() {
    this.animationState = 'startLeft';
    if (this.animationState == 'startLeft') {
      this.animationState = 'endLeft';
    } else if (this.animationState == 'endLeft') {
      this.animationState = 'startLeft';
    }
    console.log(this.animationState + 'animationStateSwap');
  }

  startAnimation() {
    this.animationState = 'start';
    if (this.animationState == 'start') {
      this.animationState = 'end';
    } else if (this.animationState == 'end') {
      this.animationState = 'start';
    }
    console.log(this.animationState + 'animationState');
  }
  ngDoCheck() {
    this.currentIndex = this._CurrentIndexService.getIndex();
    this.cdr.detectChanges();
  }
  beforeChange($event: {
    event: any;
    slick: any;
    currentSlide: number;
    nextSlide: number;
  }) {
    throw new Error('Method not implemented.');
  }
  afterChange($event: {
    event: any;
    slick: any;
    currentSlide: number;
    first: boolean;
    last: boolean;
  }) {
    throw new Error('Method not implemented.');
  }
  breakpoint($event: { event: any; slick: any; breakpoint: any }) {
    throw new Error('Method not implemented.');
  }
  slickInit(event: any) {
    console.log(event);
  }
  slideConfig: any = {
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    focusOnSelect: true,
    arrows: false,
  };
  slideConfig1: any = {
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    draggable: false,
    asNavFor: '.slider-nav',
    arrows: false,
  };
  changeImgs(id: number, colorName: string) {
    console.log(id);

    this.data.forEach((el: any) => {
      if (el.id === id) {
        console.log(el);

        const foundColor = el.colors.find(
          (color: any) => color.name === colorName
        );
        foundColor ? this._DataService.updateImages(foundColor.images) : [];
        this.imgs = this._DataService.getImages();
        this.triggerReload();
      }
    });
    console.log(this.imgs);
  }

}
