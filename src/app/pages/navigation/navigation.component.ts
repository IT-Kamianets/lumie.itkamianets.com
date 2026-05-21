import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { TranslatePipe } from '../../shared/translate.pipe';

@Component({
	imports: [RouterLink, TranslateDirective, TranslatePipe],
	templateUrl: './navigation.component.html',
	styleUrl: './navigation.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
	protected readonly navItems = [
		{ label: 'Команда', icon: 'group', route: '/team' },
		{ label: 'Вакансії', icon: 'work', route: '/jobs' },

		{ label: 'Статті', icon: 'article', route: '/articles' },
		{ label: 'Відгуки', icon: 'rate_review', route: '/reviews' },

		{ label: 'Заходи', icon: 'event', route: '/events' },
		{ label: 'Акції', icon: 'sell', route: '/sales' },

		{ label: 'Меню', icon: 'restaurant_menu', route: '/menu' },
	];
}
