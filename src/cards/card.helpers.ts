import {Card} from './card';

export interface CardPredicate { (card: Card): boolean; }

export function cardMatchPredicate(card: Card): CardPredicate {
  return (otherCard: Card): boolean => {
    let sameName = otherCard.name === card.name;
    let sameSet = !card.set && !otherCard.set || card.set === otherCard.set;
    return sameName && sameSet;
  };
}
