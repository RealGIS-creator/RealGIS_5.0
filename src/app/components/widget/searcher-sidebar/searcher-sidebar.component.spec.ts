import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcherSidebarComponent } from './searcher-sidebar.component';

describe('SearcherSidebarComponent', () => {
  let component: SearcherSidebarComponent;
  let fixture: ComponentFixture<SearcherSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearcherSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearcherSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
