import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '../../shared/translate.pipe';
import { DishCard } from '../../feature/dish/dish.interface';
import { DishService } from '../../feature/dish/dish.service';

@Component({
	selector: 'app-menu-dish',
	imports: [TranslatePipe],
	templateUrl: './menu-dish.component.html',
	styleUrl: './menu-dish.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuDishComponent {
	readonly dishService = inject(DishService);

	readonly dish = input.required<DishCard>();
	readonly favoriteDishes = this.dishService.favoriteDishes;
	protected readonly isFavorite = computed(() =>
		this.favoriteDishes().includes(this.dish().slug),
	);
}
