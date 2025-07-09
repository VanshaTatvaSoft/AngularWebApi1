import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericBtn } from './generic-btn';

describe('GenericBtn', () => {
  let component: GenericBtn;
  let fixture: ComponentFixture<GenericBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
