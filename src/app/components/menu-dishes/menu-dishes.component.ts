import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '../../shared/translate.pipe';
import { DishCategoryService } from '../../feature/dish/dish-category.service';
import { toDishCard } from '../../feature/dish/dish.data';
import { Dish, DishCard, DishCategory } from '../../feature/dish/dish.interface';
import { DishService } from '../../feature/dish/dish.service';
import { MenuDishComponent } from '../menu-dish/menu-dish.component';

interface DishSection {
	id: string;
	name: string;
	description: string;
	hasDescription: boolean;
	dishes: DishCard[];
}

@Component({
	selector: 'app-menu-dishes',
	imports: [MenuDishComponent, TranslatePipe],
	templateUrl: './menu-dishes.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDishesComponent {
	private readonly _dishService = inject(DishService);
	private readonly _dishCategoryService = inject(DishCategoryService);
	readonly selectedCategories = input<DishCategory[]>();
	readonly filteredDishes = input<Dish[] | undefined>();
	readonly flatList = input(false);
	readonly selectedCategoriesSignal = this._dishCategoryService.selectedCategories;

	readonly categories = computed(() => {
		const selectedCategories = this.selectedCategories() ?? this.selectedCategoriesSignal();
		const lastSelectedCategory = selectedCategories[selectedCategories.length - 1];

		if (lastSelectedCategory?.children?.length) {
			return lastSelectedCategory.children;
		}

		if (lastSelectedCategory) {
			return [lastSelectedCategory];
		}

		const defaultCategory = this._dishCategoryService.categories()[0];

		if (defaultCategory?.children?.length) {
			return defaultCategory.children;
		}

		return defaultCategory ? [defaultCategory] : [];
	});

	protected readonly sections = computed(() =>
		this.categories()
			.map((category) => this._toSection(category))
			.filter((section) => section.dishes.length > 0),
	);
	protected readonly flatDishes = computed(() =>
		(this.filteredDishes() ?? this._dishService.dishes()).map((dish) => this._toMenuDish(dish)),
	);

	private _toSection(category: DishCategory): DishSection {
		return {
			id: category.slug,
			name: category.name,
			description: category.description,
			hasDescription: Boolean(category.description?.trim()),
			dishes: this._collectDishes(category),
		};
	}

	private _collectDishes(category: DishCategory): DishCard[] {
		const categories = this._dishCategoryService.flatCategories();
		const categorySlugs = [
			category.slug,
			...categories
				.filter((entry) => entry.parent === category.slug)
				.map((entry) => entry.slug),
		];

		const dishesToFilter = this.filteredDishes() ?? this._dishService.dishes();

		return dishesToFilter
			.filter((dish) => categorySlugs.includes(dish.categorySlug))
			.map((dish) => this._toMenuDish(dish));
	}

	private _toMenuDish(dish: Dish): DishCard {
		return toDishCard(dish);
	}
}
