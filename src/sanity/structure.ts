import type { StructureResolver } from 'sanity/structure';

import { sanityApiVersion } from './env';
import { sanityLanguages } from './languages';

/**
 * Studio'nun sol menüsü.
 *
 * Varsayılan menü bütün doküman tiplerini düz bir liste hâlinde gösteriyor —
 * orada hem TR hem EN yazılar aynı listede karışıyor, üstelik eklentinin
 * teknik `translation.metadata` dokümanları da görünüyordu. Editör için
 * anlamlı olan bölümleme dile göre olduğundan menüyü elle kuruyoruz.
 *
 * Her dil listesindeki "yeni yazı" düğmesi eklentinin ürettiği
 * `post-<dil>` şablonunu kullanır; böylece yeni doküman doğru `language`
 * değeriyle açılır.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('İçerik')
    .items([
      S.listItem()
        .id('posts')
        .title('Blog yazıları')
        .child(
          S.list()
            .id('posts-by-language')
            .title('Blog yazıları')
            .items(
              sanityLanguages.map((language) =>
                S.listItem()
                  .id(language.id)
                  .title(language.title)
                  .child(
                    S.documentList()
                      .id(`posts-${language.id}`)
                      .title(language.title)
                      .apiVersion(sanityApiVersion)
                      .filter('_type == "post" && language == $language')
                      .params({ language: language.id })
                      .defaultOrdering([
                        { field: 'publishedAt', direction: 'desc' },
                      ])
                      .initialValueTemplates([
                        S.initialValueTemplateItem(`post-${language.id}`),
                      ]),
                  ),
              ),
            ),
        ),
      // Hackathon'lar dile göre bölünmüyor: dil alan seviyesinde, yani tek
      // kayıt iki dili de taşıyor (bkz. schemaTypes/localized.ts).
      S.documentTypeListItem('hackathon')
        .title('Hackathonlar')
        .child(
          S.documentTypeList('hackathon')
            .title('Hackathonlar')
            .defaultOrdering([{ field: 'year', direction: 'desc' }]),
        ),
      S.documentTypeListItem('author').title('Yazarlar'),
    ]);
