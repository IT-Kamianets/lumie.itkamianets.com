import { computed, Injectable, signal } from '@angular/core';
import dishCategoriesData from '../../../data/dishCategories.json';
import { DishCategory } from './dish.interface';

@Injectable({
	providedIn: 'root',
})
export class DishCategoryService {
	private readonly _fallbackCategories = (dishCategoriesData as DishCategory[]).map(
		(category) => ({
			...category,
		}),
	);

	private readonly _categories = signal<DishCategory[]>(this._fallbackCategories);

	readonly flatCategories = this._categories.asReadonly();
	readonly categories = computed<DishCategory[]>(() =>
		this._categories()
			.filter((category) => !category.parent)
			.map((category) => this._mapCategory(category)),
	);
	readonly selectedCategories = signal<DishCategory[]>([]);

	setCategories(categories: DishCategory[] | null | undefined) {
		this._categories.set(
			Array.isArray(categories) && categories.length > 0
				? categories
				: this._fallbackCategories,
		);
	}

	clearSelection() {
		this.selectedCategories.set([]);
	}

	selectCategory(category: DishCategory, _categories: DishCategory[]) {
		this.selectedCategories.set(this._buildCategoryPath(category));
	}

	private _buildCategoryPath(category: DishCategory): DishCategory[] {
		const categories = this._categories();
		const path: DishCategory[] = [category];
		let parentSlug = category.parent;

		while (parentSlug) {
			const parentCategory = categories.find((entry) => entry.slug === parentSlug);

			if (!parentCategory) {
				break;
			}

			path.unshift(parentCategory);
			parentSlug = parentCategory.parent;
		}

		return path;
	}

	private _mapCategory(category: DishCategory): DishCategory {
		const children = this._categories()
			.filter((_category) => _category.parent === category.slug)
			.map((_category) => this._mapCategory(_category));

		return {
			...category,
			children,
		};
	}
}
