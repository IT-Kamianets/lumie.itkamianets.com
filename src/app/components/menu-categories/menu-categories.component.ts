import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '../../shared/translate.pipe';
import { DishCategoryService } from '../../feature/dish/dish-category.service';
import { DishCategory } from '../../feature/dish/dish.interface';

@Component({
	selector: 'app-menu-categories',
	imports: [TranslatePipe],
	templateUrl: './menu-categories.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuCategoriesComponent {
	readonly filteredCategories = input.required<DishCategory[]>();
	readonly filteredSelectedCategories = input.required<DishCategory[]>();
	readonly dishCategoryService = inject(DishCategoryService);
	readonly selectedCategoriesSignal = this.dishCategoryService.selectedCategories;
	protected readonly categoryGroups = computed(() => {
		const categories = this.filteredCategories();
		const selectedCategories = this.filteredSelectedCategories();
		const selectedTopCategorySlug = selectedCategories[0]?.slug ?? categories[0]?.slug;
		const selectedTopCategory = categories.find(
			(category) => category.slug === selectedTopCategorySlug,
		);

		return selectedTopCategory ? this._collectCategoryGroups([selectedTopCategory]) : [];
	});

	protected isSelectedCategory(
		category: DishCategory,
		selectedCategories: DishCategory[],
	): boolean {
		return selectedCategories.some(
			(selectedCategory) => selectedCategory.slug === category.slug,
		);
	}

	private _collectCategoryGroups(categories: DishCategory[]): DishCategory[] {
		return categories.flatMap((category) => [
			...(category.children?.length ? [category] : []),
			...this._collectCategoryGroups(category.children ?? []),
		]);
	}
}
