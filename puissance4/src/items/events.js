
import { ObserverKey, observers } from "../../../samlib/observers/ObserverGroup.mjs";
import { Item } from "../field/Item.mjs";

/**
 * Un objet a été invoqué par un autre objet.
 * @type {ObserverKey<{pos:[number,number], item: Item, summoned:Item, summoned_pos:[number,number]}>}
 */
export const on_summon=new ObserverKey("on_summon")

/**
 * Un objet a été attrapé par un autre objet.
 * @type {ObserverKey<{pos:[number,number], item: Item, previous:Item?, grabbed:Item, grabbed_pos:[number,number]}>}
 */
export const on_grab=new ObserverKey("on_grab")

/**
 * Un objet a été détruit par un autre objet.
 * @type {ObserverKey<{pos:[number,number], item: Item, destroyed:Item, destroyed_pos:[number,number]}>}
 */
export const on_destroy=new ObserverKey("on_destroy")

/**
 * Un objet a été cassé.
 * @type {ObserverKey<{pos:[number,number], item: Item}>}
 */
export const on_broken=new ObserverKey("on_broken")

/**
 * Un objet a été tué.
 * @type {ObserverKey<{pos:[number,number], item: Item}>}
 */
export const on_die=new ObserverKey("on_die")

/**
 * Un objet a mange un autre objet.
 * @type {ObserverKey<{pos:[number,number], eater: Item, eaten: Item}>}
 */
export const on_eat=new ObserverKey("on_eat")

/**
 * Un objet explose
 * @type {ObserverKey<{pos:[number,number], item: Item}>}
 */
export const on_explode=new ObserverKey("on_explode")

/**
 * Un objet attaque un autre objet.
 * @type {ObserverKey<{pos:[number,number], attacker: Item, attacked_pos:[number,number], attacked: Item}>}
 */
export const on_attack=new ObserverKey("on_attack")

/**
 * Des objet alignables se sont alignés.
 * @type {ObserverKey<Array<[number,number]>>}
 */
export const on_alignement=new ObserverKey("on_alignement")

/**
 * Des gateaux on été combinés.
 * @type {ObserverKey<Array<[number,number]>>}
 */
export const on_crushed=new ObserverKey("on_crush")