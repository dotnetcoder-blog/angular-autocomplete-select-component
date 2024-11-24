import { Component, EventEmitter, forwardRef, Input, Output, SimpleChanges } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'dnc-autocomplete',
  templateUrl: './dnc-autocomplete.component.html',
  styleUrl: './dnc-autocomplete.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DncAutocompleteComponent),
      multi: true
    }
  ]
})
export class DncAutocompleteComponent implements ControlValueAccessor {
  @Input() items: (string | { [key: string]: any })[] = [];
  @Input() displayProperty: string = ''; 
  @Input() bindingProperty: string | null = null; 
  @Input() initialValue: any = null;
  @Input() placeholderText: string = 'Search...';
  @Input() emitProperty: boolean = true; 

  @Output() itemSelected = new EventEmitter<string | { [key: string]: any } | null>();

  filteredItems: (string | { [key: string]: any })[] = [];
  searchText: string = '';
  noResultsFound: boolean = false;
  activeIndex = -1;
  isDisabled: boolean = false;

  private initialSet = false;
  private onChange: (value: any | null) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() { }

  ngOnInit(): void {
    this.setInitialItem();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['initialValue']) {
      this.setInitialItem();
    }
  }

  private setInitialItem(): void {
    if (this.initialSet || !this.items || this.initialValue == null) {
      return;
    }

    const initialItem = this.items.find(item =>
      this.getSafeProperty(item, this.bindingProperty || this.displayProperty) === this.initialValue
    );

    if (initialItem) {
      this.searchText = this.getSafeProperty(initialItem, this.displayProperty); // Use displayProperty for the input text
      this.onChange(this.initialValue);
      this.itemSelected.emit(initialItem);
      this.initialSet = true;
    }
  }

  getSafeProperty(item: any, property: string | null): string {
    if (item == null || property == null) return ''; 
    if (typeof item === 'object') {
      return item[property] != null ? String(item[property]) : ''; 
    }
    return String(item);
  }

  onSearch(): void {
    const query = this.searchText.trim().toLowerCase();

    if (query === '') {
      this.resetSearch();
      return;
    }

    this.filteredItems = this.items.filter(item =>
      this.getSafeProperty(item, this.displayProperty).toLowerCase().includes(query)
    );

    this.noResultsFound = this.filteredItems.length === 0;
    this.activeIndex = -1;
  }

  resetSearch(): void {
    this.filteredItems = [];
    this.noResultsFound = false;
    this.onChange(null);
    this.itemSelected.emit(null);
  }

  selectItem(item: any): void {
    const displayValue = this.getSafeProperty(item, this.displayProperty); 
    const bindingValue = this.getSafeProperty(item, this.bindingProperty || this.displayProperty); 

    this.searchText = displayValue; 

    if (this.emitProperty) {
      this.onChange(bindingValue); 
    } else {
      this.onChange(item); 
    }

    this.itemSelected.emit(item); 

    this.filteredItems = [];
    this.noResultsFound = false;
    this.activeIndex = -1;
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.filteredItems.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      this.activeIndex = (this.activeIndex + 1) % this.filteredItems.length;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.activeIndex =
        (this.activeIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
      event.preventDefault();
    } else if (event.key === 'Enter' && this.activeIndex >= 0) {
      this.selectItem(this.filteredItems[this.activeIndex]);
    }
  }


  writeValue(value: any | null): void {
    let item;

    if (this.emitProperty) {
      item = this.items.find(item =>
        this.getSafeProperty(item, this.bindingProperty || this.displayProperty) === String(value)
      );
    } else {
      item = this.items.find(i => i === value);
    }

    if (item) {
      this.searchText = this.getSafeProperty(item, this.displayProperty);
    } else {
      this.searchText = '';
    }
  }

  registerOnChange(fn: (value: any | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  validate(): { [key: string]: any } | null {
    const isValid = this.items.some(item =>
      this.getSafeProperty(item, this.bindingProperty || this.displayProperty) === this.searchText
    );
    return isValid ? null : { invalidSelection: true };
  }
}

