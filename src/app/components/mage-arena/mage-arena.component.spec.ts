import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MageArenaComponent } from './mage-arena.component';

describe('MageArenaComponent', () => {
  let component: MageArenaComponent;
  let fixture: ComponentFixture<MageArenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MageArenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MageArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
