import { Lecture } from '../lectures/entities/lecture.entity';
import { Factory } from './seed.utils';

class LectureFactory extends Factory<Lecture> {
  constructor() {
    super(Lecture);
  }

  public generate() {
    const lecture = new Lecture();
    lecture.subject = this.faker.lorem.sentence();
    lecture.body = this.faker.lorem.sentences(10);
    lecture.index = 0;

    this.entities.push(lecture);
    return lecture;
  }
}
export const lectureFactory = new LectureFactory();

export const seedLectures = () => [
  lectureFactory.generateFromData({
    subject: 'Wykład 1: Podstawy ruchu drogowego',
    index: 1,
    body: `<p>Witajcie! Dziś rozpoczynamy kurs na prawo jazdy. W trakcie naszych spotkań nauczymy się podstaw ruchu drogowego oraz przepisów, które należy przestrzegać, aby bezpiecznie poruszać się po drodze.</p><h2>1. Co to jest ruch drogowy?</h2><p>Ruch drogowy to przemieszczanie się pojazdów oraz innych uczestników ruchu po drogach publicznych. W skład uczestników ruchu drogowego wchodzą m.in. kierowcy, piesi, rowerzyści, motocykliści oraz pasażerowie.</p><h2>2. Podstawowe zasady ruchu drogowego</h2><p>Podstawową zasadą ruchu drogowego jest bezpieczeństwo. Każdy uczestnik ruchu drogowego powinien zachowywać ostrożność oraz przestrzegać przepisów drogowych. Przepisy te regulują m.in. prędkość poruszania się pojazdów, sposób wyprzedzania, zachowanie na skrzyżowaniach oraz obowiązek korzystania z pasów ruchu.</p><h2>3. Znaki drogowe</h2><p>Aby ułatwić poruszanie się po drogach oraz zapewnić bezpieczeństwo, stosuje się znaki drogowe. Znaki te informują o ograniczeniach prędkości, kierunku jazdy, obowiązku zatrzymania się oraz wielu innych kwestiach.</p><h2>4. Prawa i obowiązki kierowcy</h2><p>Kierowcy mają obowiązek przestrzegania przepisów drogowych oraz zachowania ostrożności na drodze. Ponadto, kierowcy muszą posiadać ważne prawo jazdy oraz ubezpieczenie OC. Przepisy drogowe nakładają na kierowców także obowiązek korzystania z pasów ruchu, stosowania sygnałów dźwiękowych oraz zapinania pasów bezpieczeństwa.</p><h2>5. Podsumowanie</h2><p>Dzisiejszy wykład był poświęcony podstawom ruchu drogowego. Nauczyliśmy się, czym jest ruch drogowy oraz jakie są podstawowe zasady, których należy przestrzegać. Omówiliśmy także znaki drogowe oraz prawa i obowiązki kierowcy. W kolejnych wykładach będziemy kontynuować naszą naukę, poznając szczegółowe przepisy drogowe oraz omawiając różne sytuacje, jakie mogą wystąpić na drodze.</p>`,
  }),
  lectureFactory.generateFromData({
    subject: 'Wykład 2: Przepisy ruchu drogowego',
    index: 2,
    body: `<p>Witajcie ponownie! Dzisiaj kontynuujemy nasz kurs na prawo jazdy i omówimy bardziej szczegółowo przepisy ruchu drogowego.</p><h2>1. Prędkość</h2><p>Prędkość to jedna z najważniejszych kwestii, na jakie muszą zwracać uwagę kierowcy. Przepisy drogowe nakładają na kierowców obowiązek dostosowania prędkości do warunków drogowych oraz ograniczeń wynikających z przepisów. W terenie zabudowanym prędkość nie może przekraczać 50 km/h, a poza terenem zabudowanym - 90 km/h, chyba że znaki drogowe stanowią inaczej.</p><h2>2. Skrzyżowania</h2><p>Skrzyżowania to miejsca, w których drogi krzyżują się ze sobą. Przepisy drogowe nakładają na kierowców obowiązek zachowania szczególnej ostrożności na skrzyżowaniach oraz ustąpienia pierwszeństwa innym uczestnikom ruchu, którzy mają na to prawo. Przykładowo, kierowca, który skręca w prawo, musi ustąpić pierwszeństwa pieszym oraz rowerzystom, którzy przechodzą przez jezdnię na pasach.</p><h2>3. Wyprzedzanie</h2><p>Wyprzedzanie to manewr, którego celem jest przejechanie obok pojazdu jadącego w tym samym kierunku. Przepisy drogowe nakładają na kierowców obowiązek wyprzedzania bezpiecznie oraz z zachowaniem odpowiedniej odległości od wyprzedzanego pojazdu. Przy wyprzedzaniu należy także pamiętać o sygnalizowaniu zmiany kierunku jazdy oraz o zachowaniu szczególnej ostrożności w przypadku wyprzedzania pojazdów wolno poruszających się, takich jak np. ciągniki rolnicze.</p><h2>4. Alkohol i inne środki psychoaktywne</h2><p>Kierowanie pojazdem pod wpływem alkoholu lub innych środków psychoaktywnych jest surowo zabronione. Przepisy drogowe określają dopuszczalną wartość stężenia alkoholu we krwi oraz nakładają na kierowców obowiązek przeprowadzenia testu alkomatem w przypadku kontroli drogowej.</p><h2>5. Podsumowanie</h2><p>Dzisiejszy wykład był poświęcony przepisom ruchu drogowego. Nauczyliśmy się, jakie ograniczenia dotyczą prędkości i jak zachowywać się na skrzyżowaniach. Omówiliśmy także zasady wyprzedzania oraz zakaz kierowania pojazdem pod wpływem alkoholu lub innych środków psychoaktywnych. W kolejnych wykładach będziemy kontynuować naszą naukę, poznając kolejne przepisy drogowe oraz omawiając różne sytuacje, jakie mogą wystąpić na drodze.</p>`,
  }),
  lectureFactory.generateFromData({
    subject: 'Wykład 3: Bezpieczeństwo na drodze',
    index: 3,
    body: `<p>Witajcie! Dzisiaj porozmawiamy o bezpieczeństwie na drodze. Bezpieczeństwo jest kluczowe dla wszystkich uczestników ruchu drogowego, a przestrzeganie przepisów oraz zachowanie ostrożności to podstawowe środki zapewniające bezpieczeństwo na drodze.</p><h2>1. Pas bezpieczeństwa</h2><p>Pas bezpieczeństwa to jedno z najważniejszych urządzeń zwiększających bezpieczeństwo podczas jazdy samochodem. Kierowcy oraz pasażerowie mają obowiązek zapinania pasów bezpieczeństwa podczas jazdy. Pasy te chronią przed urazami w przypadku wypadku oraz zapobiegają wypadnięciu z pojazdu w trakcie zderzenia.</p><h2>2. Oświetlenie pojazdu</h2><p>Oświetlenie pojazdu jest niezwykle ważne dla bezpieczeństwa na drodze, zwłaszcza w warunkach ograniczonej widoczności, np. podczas jazdy w nocy lub w trudnych warunkach atmosferycznych. Kierowcy mają obowiązek korzystania z oświetlenia zgodnie z przepisami, a nieprawidłowe korzystanie z oświetlenia może prowadzić do niebezpiecznych sytuacji na drodze.</p><h2>3. Piesi i rowerzyści</h2><p>Piesi i rowerzyści to ważni uczestnicy ruchu drogowego, którzy muszą również przestrzegać przepisów oraz zachowywać ostrożność na drodze. Piesi mają obowiązek korzystania z chodników i przejść dla pieszych. Rowerzyści natomiast mają obowiązek korzystania z drogi, a w przypadku braku drogi rowerowej, z pobocza. Przepisy drogowe nakładają na pieszych i rowerzystów także obowiązek korzystania z odblasków oraz noszenia kasków.</p><h2>4. Sytuacje awaryjne</h2><p>Każdy kierowca powinien być przygotowany na sytuacje awaryjne, takie jak np. awaria pojazdu lub wypadek drogowy. Przepisy drogowe nakładają na kierowców obowiązek zachowania ostrożności oraz przeprowadzenia ewentualnej ewakuacji pojazdu w przypadku awarii lub wypadku.</p><h2>5. Podsumowanie</h2><p>Dzisiejszy wykład był poświęcony bezpieczeństwu na drodze. Nauczyliśmy się, jakie znaczenie mają pasy bezpieczeństwa oraz oświetlenie pojazdu dla bezpieczeństwa na drodze. Omówiliśmy także zasady, jakie obowiązują pieszych i rowerzystów oraz jak przygotować się na sytuacje awaryjne. W kolejnych wykładach będziemy kontynuować naszą naukę, poznając kolejne aspekty bezpieczeństwa na drodze oraz omawiając różne sytuacje, jakie mogą wystąpić podczas jazdy.</p>`,
  }),
];
