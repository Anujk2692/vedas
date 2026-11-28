import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { HomeComponent } from './pages/home/home.component';
import { ScripturesComponent } from './pages/scriptures/scriptures.component';
import { VedaDetailComponent } from './pages/veda-detail/veda-detail.component';
import { ChapterComponent } from './pages/chapter/chapter.component';
import { GyanComponent } from './pages/gyan/gyan.component';
import { StudyPathComponent } from './pages/study-path/study-path.component';
import { TopicComponent } from './pages/topic/topic.component';
import { SearchComponent } from './pages/search/search.component';
import { AartisComponent } from './pages/aartis/aartis.component';
import { AartiDetailComponent } from './pages/aarti-detail/aarti-detail.component';
import { AiGuruComponent } from './pages/ai-guru/ai-guru.component';
import { MeditationComponent } from './pages/meditation/meditation.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { CultureComponent } from './pages/culture/culture.component';
import { ClarityComponent } from './pages/clarity/clarity.component';
import { ChildNamesComponent } from './pages/child-names/child-names.component';
import { DevotionalComponent } from './pages/devotional/devotional.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'scriptures', component: ScripturesComponent },
      { path: 'scriptures/:slug', component: VedaDetailComponent },
      { path: 'chapter/:id', component: ChapterComponent },
      { path: 'gyan', component: GyanComponent },
      { path: 'gyan/path/:slug', component: StudyPathComponent },
      { path: 'gyan/topic/:slug', component: TopicComponent },
      { path: 'clarity', component: ClarityComponent },
      { path: 'child-names', component: ChildNamesComponent },
      { path: 'search', component: SearchComponent },
      { path: 'aartis', component: AartisComponent },
      { path: 'aartis/:slug', component: AartiDetailComponent },
      { path: 'chalisas', component: DevotionalComponent, data: { mode: 'chalisas' } },
      { path: 'chalisas/:slug', component: DevotionalComponent, data: { mode: 'chalisas' } },
      { path: 'bhajans', component: DevotionalComponent, data: { mode: 'bhajans' } },
      { path: 'bhajans/:slug', component: DevotionalComponent, data: { mode: 'bhajans' } },
      { path: 'ai-guru', component: AiGuruComponent },
      { path: 'meditation', component: MeditationComponent },
      { path: 'subscription', component: SubscriptionComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'quiz/:id', component: QuizComponent },
      { path: 'culture', component: CultureComponent },
      { path: 'culture/:kind', component: CultureComponent },
      { path: 'culture/:kind/:slug', component: CultureComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
