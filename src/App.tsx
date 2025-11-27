import React, { useState, useEffect, useRef } from 'react';
import { 
  Sword, Shield, Skull, Heart, Zap, 
  ChevronRight, RefreshCw, BookOpen, 
  Flame, Droplets, AlertTriangle, Target, 
  Ghost, Cross, User, ArrowRight, Play, Plus, Layers, X, Info, Package, Bell, Trash2, Anchor, Check
} from 'lucide-react';

// --- CONSTANTS & TYPES ---

const CardType = {
  ATTACK: 'Attack',
  SKILL: 'Skill',
  POWER: 'Power',
  TRAP: 'Trap'
};

const CardRarity = {
  COMMON: 'Common',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
  TOKEN: 'Token'
};

const CardTarget = {
  SINGLE: 'Single Enemy',
  ALL: 'All Enemies',
  SELF: 'Self',
  RANDOM: 'Random'
};

const StatusEffect = {
  BLOCK: 'Block',
  VULNERABLE: 'Vulnerable',
  WEAK: 'Weak',
  STRENGTH: 'Strength',
  BLEED: 'Bleed',
  POISON: 'Poison',
  BURN: 'Burn',
  EVASION: 'Evasion',
  HOLY_FERVOR: 'Holy Fervor',
  STUN: 'Stun',
  DAZED: 'Dazed',
  TENACITY: 'Tenacity',
  PROTECTION: 'Protection',
  RAGE: 'Rage',
  BLOODTHIRST: 'Bloodthirst',
  ENTANGLED: 'Entangled',
  BLIGHTED: 'Blighted',
  AUGMENT: 'Augment',
  THORNS: 'Thorns',
  REGEN: 'Regen',
  GESTATING: 'Gestating',
  WISDOM: 'Wisdom',
  RECKLESS: 'Reckless',
  WEAPON_MASTERY: 'Weapon Mastery'
};

// List of Negative Effects blocked by Protection
const DEBUFFS = [
    StatusEffect.VULNERABLE,
    StatusEffect.WEAK,
    StatusEffect.BLEED,
    StatusEffect.POISON,
    StatusEffect.BURN,
    StatusEffect.STUN,
    StatusEffect.DAZED,
    StatusEffect.ENTANGLED,
    StatusEffect.BLIGHTED
];

const ClassTag = {
  CRUSADER: 'CRUSADER',
  KNIGHT: 'KNIGHT',
  ZEALOT: 'ZEALOT',
  INQUISITOR: 'INQUISITOR',
  HOLY: 'HOLY',
  BLESSING: 'BLESSING'
};

const EnemyTier = {
  MINION: 'Minion',
  MINIBOSS: 'Miniboss',
  BOSS: 'Boss'
};

const EnemyGrade = {
  B: 'B',
  A: 'A',
  S: 'S'
};

const EnemyMoveCategory = {
  BASE: 'Base',
  TACTIC: 'Tactic',
  LAST_RESORT: 'LastResort'
};

const IntentType = {
  ATTACK: 'Attack',
  DEFEND: 'Defend',
  BUFF: 'Buff',
  DEBUFF: 'Debuff',
  SPECIAL: 'Special'
};

const EquipmentSlot = {
  HEAD: 'Head',
  RIGHT_HAND: 'Right Hand',
  LEFT_HAND: 'Left Hand',
  BODY: 'Body'
};

const ScalingFactor = {
    STRENGTH: 'Strength',
    BLOCK: 'Block',
    HEALTH_LOST: 'HealthLost',
    HEALTH_LOST_THIS_TURN: 'HealthLostThisTurn',
    CURRENT_HP: 'CurrentHp',
    DEBUFF_COUNT: 'DebuffCount',
    HOLY_FERVOR: 'HolyFervor',
    AUGMENT: 'Augment',
    ENEMY_MAX_HP_PERCENT: 'EnemyMaxHpPercent',
    DISCARD_PILE_CLASS_COUNT: 'DiscardPileClassCount',
    DISCARD_PILE_TOTAL_COST: 'DiscardPileTotalCost',
    DISCARD_PILE_COUNT: 'DiscardPileCount',
    TARGET_DISCARD_PILE_COUNT: 'TargetDiscardPileCount',
    NON_PLAYED_CARDS_LAST_TURN: 'NonPlayedCardsLastTurn',
    BLEED_STACKS: 'BleedStacks',
    EXHAUSTED_CARD_COUNT: 'ExhaustedCardCount'
};

const TargetCondition = {
    HAS_POISON: 'HasPoison',
    HAS_BLEED: 'HasBleed',
    HAS_DEBUFF: 'HasDebuff'
};

// --- DATA: KEYWORDS ---

const KEYWORDS = {
  "Block": "Prevents incoming damage. Removed at the start of your turn.",
  "Vulnerable": "Target takes 50% more damage from Attacks.",
  "Weak": "Target deals 25% less damage with Attacks.",
  "Strength": "Increases damage dealt by Attacks by X.",
  "Bleed": "Target takes X damage at the start of their turn.",
  "Poison": "Target takes X damage whenever they play a card/move. Decreases by 1 after triggering.",
  "Burn": "Target takes X damage whenever they are hit by an Attack. Decreases by 1 at end of turn.",
  "Evasion": "Negates the next Attack received. Consumes 1 stack.",
  "Holy Fervor": "Crusader resource. Does not decay. Used to scale specific cards.",
  "Stun": "Unit cannot act for a turn.",
  "Dazed": "Draw X less cards at the start of next turn.",
  "Tenacity": "Increases Block gained from cards by X.",
  "Protection": "Negates the next Debuff applied to the unit.",
  "Innate": "Start with this card in your opening hand.",
  "Volatile": "If this card is discarded, it is Exhausted (removed from combat).",
  "Retain": "This card is not discarded at the end of your turn.",
  "Ranged": "Attack ignores Evasion.",
  "Exhaust": "Remove card from the deck for the rest of combat.",
  "Mill": "Move cards from Draw Pile to Discard Pile.",
  "Augment": "Increases damage of Skills by stack count.",
  "Dispel": "Remove Buffs or Debuffs.",
  "Thorns": "Deal X damage to attacker when hit.",
  "Rage": "Gain 1 Strength when taking damage.",
  "Bloodthirst": "Gain 1 Strength when anyone gains Bleed.",
  "Entangled": "Cannot use non-Ranged Attacks.",
  "Blighted": "Poison stacks are not removed when they trigger damage.",
  "Lifevamp": "Heal for 100% of unblocked damage dealt.",
  "Regen": "Heal X HP at start of turn.",
  "Gestating": "Boss Mechanic: Checks Block at start of turn. If >0 Spawns minion, if 0 Stunned.",
  "Debuff": "A Negative Status Effect applied to a unit.",
  "Wisdom": "Draw X additional cards at the start of your turn.",
  "Craft": "Choose 1 card from 3 options to create.",
  "Reckless": "Start of Turn: Automatically plays the first drawn card with -1 Cost (if possible).",
  "Weapon Mastery": "Doubles the effectiveness of Main Hand and Off Hand passives."
};

const KEYWORD_REGEX = new RegExp(`\\b(?:${Object.keys(KEYWORDS).join('|')})\\b`, 'gi');

// --- DATA: EQUIPMENT CONFIG ---

const EQUIPMENT_DB = {
    'greathelm': { name: 'Greathelm', desc: 'Start Combat: Gain 1 Protection.', slot: EquipmentSlot.HEAD },
    'rusty_mail': { name: 'Rusty Mail', desc: '+10 Max HP.', slot: EquipmentSlot.BODY },
    'shortsword': { name: 'Shortsword', desc: '+1 Damage to Attacks.', slot: EquipmentSlot.RIGHT_HAND },
    'kite_shield': { name: 'Kite Shield', desc: 'Start Combat: Add 4 Shield Blocks to Deck.', slot: EquipmentSlot.LEFT_HAND },
    'greatsword': { name: 'Greatsword', desc: 'Start Combat: Add 4 Cleaves to Deck.', slot: EquipmentSlot.RIGHT_HAND },
    'locked': { name: 'Locked', desc: 'Cannot equip Off-hand.', slot: EquipmentSlot.LEFT_HAND },
    'morningstar': { name: 'Morningstar', desc: 'Attacks have 50% chance to apply 1 Bleed.', slot: EquipmentSlot.RIGHT_HAND },
    'scriptures': { name: 'Sacred Scriptures', desc: 'Start of Turn: Scry 1 (Not Implemented in Demo).', slot: EquipmentSlot.LEFT_HAND },
};

// --- DATA: CARDS ---

const createCard = (props) => ({
  effect: () => {},
  baseDamage: 0,
  baseBlock: 0,
  rarity: CardRarity.COMMON,
  target: CardTarget.SINGLE,
  cardClass: [],
  cost: 1,
  type: CardType.SKILL,
  ...props
});

const getEnemy = (g, id) => g.enemies.find(e => e.id === id);

const applyStatus = (g, target, status, amount, logs = []) => {
  if (!target) return;
  if (target.effects[StatusEffect.PROTECTION] && DEBUFFS.includes(status)) {
    target.effects[StatusEffect.PROTECTION]--;
    logs.push(`${target.name}: Protection negated ${status}!`);
    if (target.effects[StatusEffect.PROTECTION] <= 0) delete target.effects[StatusEffect.PROTECTION];
    return;
  }
  
  target.effects[status] = (target.effects[status] || 0) + amount;
  logs.push(`${target.name}: +${amount} ${status}`);

  if (status === StatusEffect.BLEED && g) {
      const allUnits = [g.player, ...g.enemies];
      allUnits.forEach(unit => {
          if (unit.effects[StatusEffect.BLOODTHIRST] && unit.currentHealth > 0) {
              unit.effects[StatusEffect.STRENGTH] = (unit.effects[StatusEffect.STRENGTH] || 0) + 1;
              logs.push(`${unit.name} gains Strength from Bloodthirst!`);
          }
      });
  }
};

const drawCards = (g, count) => {
  for (let i = 0; i < count; i++) {
    if (g.player.drawPile.length === 0) {
      if (g.player.discardPile.length === 0) break;
      g.player.drawPile = [...g.player.discardPile].sort(() => Math.random() - 0.5);
      g.player.discardPile = [];
    }
    const card = g.player.drawPile.pop();
    if (card) g.player.hand.push(card);
  }
};

const dealDamage = (g, source, target, amount, logs) => {
  if (!target) return 0;
  let dmg = amount + (source.effects[StatusEffect.STRENGTH] || 0);
  
  const masteryMultiplier = (source.effects[StatusEffect.WEAPON_MASTERY] || 0) + 1;

  if (!source.isEnemy && source.equipment.includes('shortsword')) {
      dmg += (1 * masteryMultiplier);
  }

  if (source.effects[StatusEffect.WEAK]) dmg = Math.floor(dmg * 0.75);
  if (target.effects[StatusEffect.VULNERABLE]) dmg = Math.floor(dmg * 1.5);

  if (target.effects[StatusEffect.BURN] > 0) {
      dmg += target.effects[StatusEffect.BURN];
  }
  
  if (target.effects[StatusEffect.EVASION]) {
    target.effects[StatusEffect.EVASION]--;
    logs.push(`${target.name}: Dodged attack with Evasion!`);
    if (target.effects[StatusEffect.EVASION] <= 0) delete target.effects[StatusEffect.EVASION];
    return 0;
  }
  
  if (!source.isEnemy && source.equipment.includes('morningstar')) {
      for(let i=0; i<masteryMultiplier; i++) {
         if (Math.random() > 0.5) applyStatus(g, target, StatusEffect.BLEED, 1, logs);
      }
  }

  let blocked = 0;
  let unblockedDmg = dmg;
  if (target.block > 0) {
    if (target.block >= dmg) {
      blocked = dmg;
      target.block -= dmg;
      unblockedDmg = 0;
    } else {
      blocked = target.block;
      unblockedDmg -= target.block;
      target.block = 0;
    }
    logs.push(`${target.name} blocked ${blocked} damage.`);
  }
  
  if (unblockedDmg > 0) {
    target.currentHealth -= unblockedDmg;
    logs.push(`${target.name} took ${unblockedDmg} damage!`);
    
    if (target.effects[StatusEffect.RAGE]) {
        applyStatus(g, target, StatusEffect.STRENGTH, 1, logs);
        logs.push(`${target.name} is Enraged!`);
    }
  }
  return unblockedDmg;
};

const BLESSING_CARDS = [
  createCard({ id: 'samson', name: "Samson's Strength", type: CardType.SKILL, rarity: CardRarity.TOKEN, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY, ClassTag.BLESSING], target: CardTarget.SELF, description: 'Gain 2 Strength.', effect: (g, tid, logs) => applyStatus(g, g.player, StatusEffect.STRENGTH, 2, logs) }),
  createCard({ id: 'david', name: "King David's Courage", type: CardType.SKILL, rarity: CardRarity.TOKEN, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY, ClassTag.BLESSING], target: CardTarget.SELF, description: 'Random card in hand costs 0.', effect: (g, tid, logs, src) => { 
      const valid = g.player.hand.filter(c => c.id !== src.id);
      if(valid.length > 0) { 
          const c = valid[Math.floor(Math.random()*valid.length)]; 
          c.cost = 0; 
          if(logs) logs.push(`${c.name} costs 0`); 
      } 
  } }), 
  createCard({ id: 'solomon', name: "Solomon's Wisdom", type: CardType.POWER, rarity: CardRarity.TOKEN, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY, ClassTag.BLESSING], target: CardTarget.SELF, description: 'Draw +1 card each turn.', effect: (g, tid, logs) => applyStatus(g, g.player, StatusEffect.WISDOM, 1, logs) }) 
];

const TOKEN_CARDS = {
    'shield_block': createCard({ id: 'shield_block', name: 'Shield Block', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.KNIGHT], target: CardTarget.SELF, description: 'Gain 6 Block. Draw 1.', baseBlock: 6, effect: (g, tid, logs) => drawCards(g, 1) }),
    'cleave': createCard({ id: 'cleave', name: 'Cleave', type: CardType.ATTACK, rarity: CardRarity.COMMON, cardClass: [ClassTag.ZEALOT], target: CardTarget.ALL, description: 'Deal 4 Dmg to ALL.', baseDamage: 4 }),
    'binding_trap': createCard({ 
        id: 'binding_trap', 
        name: 'Binding Trap', 
        type: CardType.TRAP, 
        rarity: CardRarity.TOKEN, 
        cost: 2, 
        target: CardTarget.SELF, 
        retain: true, 
        description: 'Retain. After draw phase, discard 1 random card. Exhausts when played.', 
        effect: (g, tid, logs) => { logs.push("Trap disarmed."); } 
    }),
};

const COMMON_CRUSADER_CARDS = [
  createCard({ id: 'strike', name: 'Strike', type: CardType.ATTACK, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SINGLE, description: 'Deal 5 Damage.', baseDamage: 5 }),
  createCard({ id: 'warcry', name: 'Warcry', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Gain 1 Strength.', effect: (g, tid, logs) => applyStatus(g, g.player, StatusEffect.STRENGTH, 1, logs) }),
  createCard({ id: 'bash', name: 'Bash', type: CardType.ATTACK, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SINGLE, description: 'Deal 8 Damage. Apply 2 Vulnerable.', baseDamage: 8, effect: (g, tid, logs) => applyStatus(g, getEnemy(g, tid), StatusEffect.VULNERABLE, 2, logs) }),
  createCard({ id: 'draw_steel', name: 'Draw Steel', type: CardType.SKILL, cost: 0, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Discard 1 random card. Draw 1 Attack.', effect: (g, tid, logs, src) => { 
      const valid = g.player.hand.filter(c => c.id !== src.id);
      if (valid.length > 0) {
        const discardIdx = Math.floor(Math.random() * valid.length);
        const target = valid[discardIdx];
        const realIdx = g.player.hand.findIndex(c => c.id === target.id);
        if (realIdx > -1) {
            const discardedCard = g.player.hand.splice(realIdx, 1)[0];
            if (discardedCard.volatile) {
                if (logs) logs.push(`${discardedCard.name} (Volatile) Exhausted.`);
            } else {
                g.player.discardPile.push(discardedCard);
            }
        }
      }
      const atk = g.player.drawPile.find((c) => c.type === CardType.ATTACK);
      if (atk) {
         g.player.drawPile = g.player.drawPile.filter((c) => c !== atk);
         g.player.hand.push(atk);
      }
  }}),
  createCard({ 
      id: 'at_ready', 
      name: 'At Ready', 
      type: CardType.SKILL, 
      rarity: CardRarity.COMMON, 
      cardClass: [ClassTag.CRUSADER], 
      target: CardTarget.SELF, 
      description: 'Choose 2 Attacks in your discard pile. Shuffle them into your deck.', 
      effect: (g, tid, logs) => {
         return {
             action: 'SELECT',
             filter: (c) => c.type === CardType.ATTACK,
             source: 'DISCARD',
             count: 2,
             title: 'Choose 2 Attacks to Shuffle',
             logic: (gState, selectedCards, currentLogs) => {
                 gState.player.discardPile = gState.player.discardPile.filter(c => !selectedCards.some(s => s.id === c.id));
                 gState.player.drawPile.push(...selectedCards);
                 gState.player.drawPile.sort(() => Math.random() - 0.5);
                 currentLogs.push(`Shuffled ${selectedCards.map(c => c.name).join(', ')} into deck.`);
             }
         };
      }
  }),
  createCard({ id: 'divine_ward', name: 'Divine Ward', type: CardType.SKILL, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SELF, description: 'Gain 2 Protection.', effect: (g, tid, logs) => applyStatus(g, g.player, StatusEffect.PROTECTION, 2, logs) }),
  createCard({ id: 'holy_smite', name: 'Holy Smite', type: CardType.ATTACK, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SINGLE, description: 'Deal dmg equal to Holy Fervor.', baseDamage: 0, effect: (g, tid, logs) => { const dmg = g.player.effects[StatusEffect.HOLY_FERVOR] || 0; dealDamage(g, g.player, getEnemy(g, tid), dmg, logs || []); g.player.effects[StatusEffect.HOLY_FERVOR] = 0; } }),
  createCard({ 
      id: 'battle_trance', 
      name: 'Battle Trance', 
      type: CardType.SKILL, 
      cost: 0, 
      rarity: CardRarity.COMMON, 
      cardClass: [ClassTag.CRUSADER], 
      target: CardTarget.SELF, 
      description: 'Condition: Hand only Attacks. Gain 2 Energy.', 
      effect: (g, tid, logs) => {
          g.player.energy += 2; 
          logs.push("Battle Trance grants 2 Energy.");
      }
  }), 
  createCard({ id: 'iron_will', name: 'Iron Will', type: CardType.POWER, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Gain 2 Tenacity.', effect: (g, tid, logs) => applyStatus(g, g.player, StatusEffect.TENACITY, 2, logs) }),
  createCard({ id: 'reckless_nature', name: 'Reckless Nature', type: CardType.POWER, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Start of Turn: Play first drawn card for -1 Energy.', effect: (g, tid, logs) => applyStatus(g, g.player, StatusEffect.RECKLESS, 1, logs) }),
  createCard({ id: 'weapon_master', name: 'Weapon Master', type: CardType.POWER, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Doubles Main/Off Hand passive effects.', effect: (g, tid, logs) => applyStatus(g, g.player, StatusEffect.WEAPON_MASTERY, 1, logs) }),
  createCard({ id: 'pray', name: 'Pray', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SELF, description: 'Craft 1 Blessing and shuffle into deck.', effect: (g) => { return { action: 'CRAFT', options: BLESSING_CARDS }; } }),
  createCard({ id: 'in_nomine', name: 'In nomine patris', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SELF, description: 'Volatile. Discard 1. Draw 1 Holy.', volatile: true, effect: (g, tid, logs, src) => {
      const valid = g.player.hand.filter(c => c.id !== src.id);
      if (valid.length > 0) {
        const discardIdx = Math.floor(Math.random() * valid.length);
        const target = valid[discardIdx];
        const realIdx = g.player.hand.findIndex(c => c.id === target.id);
        if (realIdx > -1) {
            const discardedCard = g.player.hand.splice(realIdx, 1)[0];
            if (discardedCard.volatile) {
                if (logs) logs.push(`${discardedCard.name} (Volatile) Exhausted.`);
            } else {
                g.player.discardPile.push(discardedCard);
            }
        }
      }
      const holy = g.player.drawPile.find((c) => c.cardClass.includes(ClassTag.HOLY));
      if (holy) {
          g.player.drawPile = g.player.drawPile.filter((c) => c !== holy);
          g.player.hand.push(holy);
      }
  }}),
  createCard({ id: 'harder_fall', name: 'The Harder They Fall', type: CardType.ATTACK, cost: 3, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SINGLE, description: 'Deal 20% Enemy Max HP.', baseDamage: 0, effect: (g, tid, logs) => {
      const t = getEnemy(g, tid);
      if (t) dealDamage(g, g.player, t, Math.ceil(t.maxHealth * 0.2), logs || []);
  }}),
  createCard({ id: 'commandment', name: 'Commandment', type: CardType.ATTACK, cost: 3, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SINGLE, description: 'Discard 1 Holy. Deal 5x Holy in Discard.', baseDamage: 0, effect: (g, tid, logs) => {
      const holyInHand = g.player.hand.find((c) => c.cardClass.includes(ClassTag.HOLY) && c.id !== 'commandment');
      if (holyInHand) {
          g.player.hand = g.player.hand.filter((c) => c !== holyInHand);
          if (holyInHand.volatile) {
              if (logs) logs.push(`${holyInHand.name} (Volatile) Exhausted.`);
          } else {
              g.player.discardPile.push(holyInHand);
          }
      }
      const holyCount = g.player.discardPile.filter((c) => c.cardClass.includes(ClassTag.HOLY)).length;
      dealDamage(g, g.player, getEnemy(g, tid), holyCount * 5, logs || []);
  }}),
  createCard({ id: 'bigger_they_are', name: 'The Bigger They Are', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SINGLE, description: 'Apply 2 Weak. Shuffle "Harder They Fall" into deck.', effect: (g, tid, logs) => {
      applyStatus(g, getEnemy(g, tid), StatusEffect.WEAK, 2, logs);
      g.player.drawPile.push({...COMMON_CRUSADER_CARDS.find(c => c.id === 'harder_fall'), id: `gen_${Date.now()}`});
      g.player.drawPile.sort(() => Math.random() - 0.5);
  }}),
  createCard({ id: 'our_father', name: 'Our Father...', type: CardType.SKILL, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SELF, description: 'Volatile. Double Holy Fervor.', volatile: true, effect: (g, tid, logs) => {
      const current = g.player.effects[StatusEffect.HOLY_FERVOR] || 0;
      applyStatus(g, g.player, StatusEffect.HOLY_FERVOR, current, logs);
  }})
];

const KNIGHT_CARDS = [
  createCard({ id: 'shield_block', name: 'Shield Block', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.KNIGHT], target: CardTarget.SELF, description: 'Gain 6 Block. Draw 1.', baseBlock: 6, effect: (g) => drawCards(g, 1) }),
  createCard({ id: 'shield_bash', name: 'Shield Bash', type: CardType.ATTACK, rarity: CardRarity.COMMON, cardClass: [ClassTag.KNIGHT], target: CardTarget.SINGLE, description: 'Deal Dmg equal to Block.', baseDamage: 0, effect: (g, tid, logs) => dealDamage(g, g.player, getEnemy(g, tid), g.player.block, logs || []) }),
  createCard({ 
      id: 'hold_fast', 
      name: 'Hold Fast', 
      type: CardType.SKILL, 
      rarity: CardRarity.COMMON, 
      cardClass: [ClassTag.KNIGHT], 
      target: CardTarget.SELF, 
      description: 'Choose 1 card in hand to Retain.', 
      effect: (g, tid, logs) => { 
          return {
            action: 'SELECT',
            filter: (c) => true,
            source: 'HAND',
            count: 1,
            title: 'Select a card to Retain',
            logic: (gState, selectedCards, currentLogs) => {
                if (selectedCards.length > 0) {
                    const target = gState.player.hand.find(c => c.id === selectedCards[0].id);
                    if (target) {
                        target.retain = true;
                        currentLogs.push(`${target.name} is being Retained.`);
                    }
                }
            }
        };
      } 
  }),
];

const ZEALOT_CARDS = [
  createCard({ id: 'cleave', name: 'Cleave', type: CardType.ATTACK, rarity: CardRarity.COMMON, cardClass: [ClassTag.ZEALOT], target: CardTarget.ALL, description: 'Deal 4 Dmg to ALL.', baseDamage: 4 }),
  createCard({ id: 'blood_tithe', name: 'Blood Tithe', type: CardType.SKILL, cost: 0, rarity: CardRarity.COMMON, cardClass: [ClassTag.ZEALOT], target: CardTarget.SELF, description: 'Lose 3 HP. Gain 2 Energy.', effect: (g) => { g.player.currentHealth -= 3; g.player.energy += 2; } }),
];

const INQUISITOR_CARDS = [
  createCard({ id: 'condemn', name: 'Condemn', type: CardType.SKILL, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.INQUISITOR], target: CardTarget.SINGLE, description: 'Apply 2 Weak.', effect: (g, tid, logs) => applyStatus(g, getEnemy(g, tid), StatusEffect.WEAK, 2, logs) }),
  createCard({ id: 'flail', name: 'Flail', type: CardType.ATTACK, rarity: CardRarity.COMMON, cardClass: [ClassTag.INQUISITOR], target: CardTarget.SINGLE, description: 'Deal 4 Dmg. Apply 1 Bleed.', baseDamage: 4, effect: (g, tid, logs) => applyStatus(g, getEnemy(g, tid), StatusEffect.BLEED, 1, logs) }),
];

// --- DATA: ENEMIES (COMPLETE ROSTER) ---

const MINIONS_DB = {
  'tadpolearm': {
    id: 'tadpolearm', name: 'Tadpolearm', maxHealth: 28, currentHealth: 28, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.B,
    description: "A young, aggressive humanoid tadpole wielding a primitive spear.",
    moves: [
      { id: 'spear_poke', name: 'Spear Poke', description: 'Deal 6 Dmg', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 6 },
      { id: 'slippery', name: 'Slippery', description: 'Gain 1 Evasion', category: EnemyMoveCategory.TACTIC, intentType: IntentType.BUFF, statusEffects: [{status: StatusEffect.EVASION, amount: 1}] },
      { id: 'thrust', name: 'Desperate Thrust', description: '12 Dmg + 2 Bleed', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.ATTACK, damage: 12, cooldown: 3, statusEffects: [{status: StatusEffect.BLEED, amount: 2, target: 'Player'}] }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'frogman': {
    id: 'frogman', name: 'Frogman', maxHealth: 32, currentHealth: 32, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.B,
    description: "A humanoid frog engaging from a distance with a heavy crossbow.",
    moves: [
      { id: 'bolt', name: 'Iron Bolt', description: 'Deal 8 Dmg', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 8 },
      { id: 'poison', name: 'Poisoned Tip', description: 'Apply 2 Poison', category: EnemyMoveCategory.TACTIC, intentType: IntentType.DEBUFF, statusEffects: [{status: StatusEffect.POISON, amount: 2, target: 'Player'}] },
      { id: 'tongue', name: 'Tongue Grapple', description: 'Player Attacks cost +1 Energy next turn.', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.DEBUFF, cooldown: 1, mechanic: { modifyPlayerCost: { amount: 1, durationTurns: 1, cardType: CardType.ATTACK } } }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'bullyfrog': {
    id: 'bullyfrog', name: 'Bullyfrog', maxHealth: 55, currentHealth: 55, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.A,
    description: "A massive, armored bullfrog that acts as a tank.",
    moves: [
      { id: 'slam', name: 'Body Slam', description: 'Deal 10 Dmg', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 10 },
      { id: 'croak', name: 'Croak', description: 'Gain 8 Block', category: EnemyMoveCategory.TACTIC, intentType: IntentType.BUFF, statusEffects: [{status: StatusEffect.BLOCK, amount: 8}] },
      { id: 'gobble', name: 'Gobble', description: 'Heal 20 HP & Eat 2 Discard', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.SPECIAL, cooldown: 3, mechanic: { restoreHp: { amount: 20, type: 'Fixed' }, burnCards: { source: 'DiscardPile', count: 2 } } } 
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'wolf_spider': {
    id: 'wolf_spider', name: 'Giant Wolf-Spider', maxHealth: 48, currentHealth: 48, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.A,
    description: "A horrific, overgrown arachnid that entraps its prey before consuming it.",
    moves: [
      { id: 'web', name: 'Spit Web', description: 'Apply Entangled', category: EnemyMoveCategory.BASE, intentType: IntentType.DEBUFF, statusEffects: [{status: StatusEffect.ENTANGLED, amount: 1, target: 'Player'}] },
      { id: 'bite', name: 'Venomous Bite', description: '5 Dmg + 5 Block + 5 Poison', category: EnemyMoveCategory.TACTIC, intentType: IntentType.ATTACK, damage: 5, statusEffects: [{status: StatusEffect.POISON, amount: 5, target: 'Player'}, {status: StatusEffect.BLOCK, amount: 5}] },
      { id: 'cocoon', name: 'Web Cocoon', description: 'Gain 10 Block. Exhaust 3 Discards.', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.DEFEND, cooldown: 2, statusEffects: [{status: StatusEffect.BLOCK, amount: 10}], mechanic: { burnCards: { source: 'DiscardPile', count: 3 } } } 
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'kobold_fanatic': {
    id: 'kobold_fanatic', name: 'Kobold Fanatic', maxHealth: 22, currentHealth: 22, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.B,
    description: "A crazed worshipper who burns with unstable magic.",
    moves: [
      { id: 'bite', name: 'Bite', description: '6 Dmg', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 6 },
      { id: 'conjure', name: 'Conjure Fire', description: '8 Dmg + 1 Burn', category: EnemyMoveCategory.TACTIC, intentType: IntentType.ATTACK, damage: 8, statusEffects: [{status: StatusEffect.BURN, amount: 1, target: 'Player'}] },
      { id: 'immolate', name: 'Immolation', description: 'Dmg = 2x Current HP', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.ATTACK, damageScaling: ScalingFactor.CURRENT_HP, mechanic: { dealDamageToSelf: { type: 'CurrentHP' } }, cooldown: 0 } 
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'kobold_shaman': {
    id: 'kobold_shaman', name: 'Kobold Shaman', maxHealth: 45, currentHealth: 45, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.A,
    description: "A tribal caster who empowers his allies with dragonfire.",
    moves: [
      { id: 'anti', name: 'Trickster Chant', description: '1 Evasion + 1 Weak + 1 Augment', category: EnemyMoveCategory.TACTIC, intentType: IntentType.DEBUFF, statusEffects: [{status: StatusEffect.EVASION, amount: 1}, {status: StatusEffect.WEAK, amount: 1, target: 'Player'}, {status: StatusEffect.AUGMENT, amount: 1}] },
      { id: 'ritual', name: 'Fire Ritual', description: 'Buffs on Ally Death (Once)', category: EnemyMoveCategory.BASE, intentType: IntentType.BUFF, mechanic: { triggerCondition: 'OnAllyDeath' }, oneUse: true }, 
      { id: 'evoke', name: 'Evoke Dragonfire', description: '6 Dmg + Burn', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.ATTACK, damage: 6, cooldown: 0, statusEffects: [{status: StatusEffect.BURN, amount: 0, target: 'Player'}], statusScaling: ScalingFactor.AUGMENT }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'dragon_spawn': {
    id: 'dragon_spawn', name: 'Dragon Spawn', maxHealth: 35, currentHealth: 35, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.B,
    description: "A mutated, winged lizard corrupted by the Dragon's blood.",
    moves: [
      { id: 'glide', name: 'Gliding Strike', description: '6 Dmg', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 6 },
      { id: 'spit', name: 'Spitfire', description: '6 Dmg + 1 Burn', category: EnemyMoveCategory.TACTIC, intentType: IntentType.ATTACK, damage: 6, statusEffects: [{status: StatusEffect.BURN, amount: 1, target: 'Player'}] },
      { id: 'rage', name: 'Dragon Rage', description: 'Execute Gliding Strike then Spitfire', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.BUFF, mechanic: { executeMoves: ['glide', 'spit'] } }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'goblin_scout': {
    id: 'goblin_scout', name: 'Goblin Scout', maxHealth: 25, currentHealth: 25, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.B,
    description: "A nimble forward observer for the goblin hordes.",
    moves: [
      { id: 'slingshot', name: 'Slingshot', description: 'Deal 5 Dmg + 1 Evasion', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 5, statusEffects: [{status: StatusEffect.EVASION, amount: 1}] },
      { id: 'climb', name: 'Climb Trees', description: '1 Evasion', category: EnemyMoveCategory.TACTIC, intentType: IntentType.BUFF, statusEffects: [{status: StatusEffect.EVASION, amount: 1}] },
      { id: 'leap', name: 'Leap Assault', description: '8 Dmg + 2 Bleed', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.ATTACK, damage: 8, statusEffects: [{status: StatusEffect.BLEED, amount: 2, target: 'Player'}] }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'goblin_hunter': {
    id: 'goblin_hunter', name: 'Goblin Hunter', maxHealth: 35, currentHealth: 35, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.B,
    description: "A cunning trapper.",
    moves: [
      { id: 'trick', name: 'Cheap Trick', description: 'Mill 2 Cards', category: EnemyMoveCategory.BASE, intentType: IntentType.DEBUFF, mechanic: { mill: { count: 2 } } },
      { id: 'trap', name: 'Set Trap', description: 'Shuffle Binding Trap into Discard', category: EnemyMoveCategory.TACTIC, intentType: IntentType.DEBUFF, mechanic: { addCardToDiscard: { cardId: 'binding_trap', count: 1 } } },
      { id: 'booby', name: 'Booby Trap', description: 'Dmg = Discard Size', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.ATTACK, damage: 5, damageScaling: ScalingFactor.TARGET_DISCARD_PILE_COUNT } 
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'dire_wolf': {
    id: 'dire_wolf', name: 'Dire Wolf', maxHealth: 50, currentHealth: 50, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.A,
    description: "A massive, bloodthirsty predator.",
    moves: [
      { id: 'bite', name: 'Vicious Bite', description: '8 Dmg + 2 Bleed', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 8, statusEffects: [{status: StatusEffect.BLEED, amount: 2, target: 'Player'}] },
      { id: 'bloodhunt', name: 'Bloodhunt', description: 'Gain Bloodthirst', category: EnemyMoveCategory.TACTIC, intentType: IntentType.BUFF, statusEffects: [{status: StatusEffect.BLOODTHIRST, amount: 1}] },
      { id: 'pounce', name: 'Pounce', description: '12 Dmg (Str x2)', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.ATTACK, damage: 12 }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'brown_bear': {
    id: 'brown_bear', name: 'Brown Bear', maxHealth: 80, currentHealth: 80, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.S,
    description: "A territorial beast driven to a frenzy.",
    moves: [
      { id: 'maul', name: 'Maul', description: '8 Dmg + Dazed', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 8, statusEffects: [{status: StatusEffect.DAZED, amount: 1, target: 'Player'}] },
      { id: 'fury', name: 'Fury', description: 'Gain Rage', category: EnemyMoveCategory.TACTIC, intentType: IntentType.BUFF, statusEffects: [{status: StatusEffect.RAGE, amount: 1}] },
      { id: 'cornered', name: 'Cornered Menace', description: 'Maul x2', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.ATTACK, damage: 16, mechanic: { executeMoves: ['maul', 'maul'] } }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'blowgun_blight': {
    id: 'blowgun_blight', name: 'Blowgun Blight', maxHealth: 26, currentHealth: 26, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.B,
    description: "A stealthy swamp-dweller armed with a deadly blowpipe.",
    moves: [
      { id: 'blow', name: 'Blow', description: '4 Dmg + 2 Poison', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 4, statusEffects: [{status: StatusEffect.POISON, amount: 2, target: 'Player'}] },
      { id: 'dirk', name: 'Thorn Dirk', description: '6 Dmg', category: EnemyMoveCategory.TACTIC, intentType: IntentType.ATTACK, damage: 6 },
      { id: 'miasma', name: 'Miasma', description: '+1 Debuffs + 2 Evasion', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.DEBUFF, statusEffects: [{status: StatusEffect.EVASION, amount: 2}] }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'ambusher_blight': {
    id: 'ambusher_blight', name: 'Ambusher Blight', maxHealth: 30, currentHealth: 30, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.B,
    description: "A cunning fighter who strikes from the shadows.",
    moves: [
      { id: 'swamp', name: 'Swamp Strike', description: '5 Dmg + 2 Vuln', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 5, statusEffects: [{status: StatusEffect.VULNERABLE, amount: 2, target: 'Player'}] },
      { id: 'prep', name: 'Preparation', description: '1 Evasion + Next Atk Poison', category: EnemyMoveCategory.TACTIC, intentType: IntentType.BUFF, statusEffects: [{status: StatusEffect.EVASION, amount: 1}] },
      { id: 'miasma', name: 'Miasma', description: '+1 Debuffs + 2 Evasion', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.DEBUFF, statusEffects: [{status: StatusEffect.EVASION, amount: 2}] }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'witch_blight': {
    id: 'witch_blight', name: 'Witch Blight', maxHealth: 42, currentHealth: 42, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.A,
    description: "A corrupted shaman who weaves powerful curses.",
    moves: [
      { id: 'voodoo', name: 'Blight Voodoo', description: '2 Poison + Blighted', category: EnemyMoveCategory.BASE, intentType: IntentType.DEBUFF, statusEffects: [{status: StatusEffect.POISON, amount: 2, target: 'Player'}, {status: StatusEffect.BLIGHTED, amount: 1, target: 'Player'}] },
      { id: 'entangle', name: 'Entangle', description: 'Apply Entangled', category: EnemyMoveCategory.TACTIC, intentType: IntentType.DEBUFF, statusEffects: [{status: StatusEffect.ENTANGLED, amount: 1, target: 'Player'}] },
      { id: 'miasma', name: 'Miasma', description: '+1 Debuffs + 2 Evasion', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.DEBUFF, statusEffects: [{status: StatusEffect.EVASION, amount: 2}] }
    ], lastResortCooldown: 0, hasUsedLastResort: false
  },
  'man_eating_grove': {
    id: 'man_eating_grove', name: 'Man-Eating Grove', maxHealth: 120, currentHealth: 120, block: 0, effects: {}, isEnemy: true, grade: EnemyGrade.S,
    description: "A sentient, carnivorous tree.",
    moves: [
      { id: 'vines', name: 'Barbed Vines', description: '6 Dmg + 2 Bleed + Entangled', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 6, statusEffects: [{status: StatusEffect.BLEED, amount: 2, target: 'Player'}, {status: StatusEffect.ENTANGLED, amount: 1, target: 'Player'}] },
      { id: 'trap', name: 'Bug Trap', description: 'Lock Hand Edges', category: EnemyMoveCategory.TACTIC, intentType: IntentType.DEBUFF },
      { id: 'chomp', name: 'Chomp', description: '3 Dmg x Unplayed Cards', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.ATTACK, damage: 3 } 
    ], lastResortCooldown: 0, hasUsedLastResort: false
  }
};

const getCardCost = (card, player) => {
    let cost = card.cost;
    player.costModifiers.forEach(mod => {
        if (!mod.cardType || mod.cardType === card.type) {
            cost += mod.amount;
        }
    });
    return Math.max(0, cost);
};

const healUnit = (unit, amount, logs) => {
    if (unit.currentHealth >= unit.maxHealth) return;
    const actualHeal = Math.min(amount, unit.maxHealth - unit.currentHealth);
    unit.currentHealth += actualHeal;
    logs.push(`${unit.name} healed for ${actualHeal} HP.`);
};

const ICONS = {
    [StatusEffect.BLOCK]: <Shield className="w-4 h-4 text-blue-400" />,
    [StatusEffect.VULNERABLE]: <Heart className="w-4 h-4 text-red-500" />,
    [StatusEffect.WEAK]: <ArrowRight className="w-4 h-4 text-yellow-400 rotate-90" />,
    [StatusEffect.STRENGTH]: <Sword className="w-4 h-4 text-red-400" />,
    [StatusEffect.BLEED]: <Droplets className="w-4 h-4 text-red-600" />,
    [StatusEffect.POISON]: <Flask className="w-4 h-4 text-green-500" />,
    [StatusEffect.BURN]: <Flame className="w-4 h-4 text-orange-500" />,
    [StatusEffect.EVASION]: <Ghost className="w-4 h-4 text-slate-400" />,
    [StatusEffect.HOLY_FERVOR]: <Cross className="w-4 h-4 text-yellow-300" />,
    [StatusEffect.STUN]: <Zap className="w-4 h-4 text-yellow-500" />,
    [StatusEffect.DAZED]: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
    [StatusEffect.TENACITY]: <Shield className="w-4 h-4 text-blue-300" />,
    [StatusEffect.PROTECTION]: <Shield className="w-4 h-4 text-white" />,
    [StatusEffect.RAGE]: <Flame className="w-4 h-4 text-red-600" />,
    [StatusEffect.BLOODTHIRST]: <Droplets className="w-4 h-4 text-red-800" />,
    [StatusEffect.ENTANGLED]: <Anchor className="w-4 h-4 text-green-700" />,
    [StatusEffect.BLIGHTED]: <Skull className="w-4 h-4 text-purple-500" />,
    [StatusEffect.AUGMENT]: <Plus className="w-4 h-4 text-purple-400" />,
    [StatusEffect.THORNS]: <Target className="w-4 h-4 text-green-500" />,
    [StatusEffect.REGEN]: <Heart className="w-4 h-4 text-green-400" />,
    [StatusEffect.GESTATING]: <Ghost className="w-4 h-4 text-purple-300" />,
    [StatusEffect.WISDOM]: <BookOpen className="w-4 h-4 text-blue-400" />,
    [StatusEffect.RECKLESS]: <Sword className="w-4 h-4 text-red-500" />,
    [StatusEffect.WEAPON_MASTERY]: <Sword className="w-4 h-4 text-yellow-600" />
};

function Flask(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 2v7.31"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>
}


// --- COMPONENT ---

export default function GameDemo() {
  const [screen, setScreen] = useState('INTRO');
  const [subclass, setSubclass] = useState('');
  const [deck, setDeck] = useState([]);
  const [step, setStep] = useState(1);
  
  const [gameMode, setGameMode] = useState('CLASSIC'); 
  const [customEnemies, setCustomEnemies] = useState([]); 

  const [player, setPlayer] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [turn, setTurn] = useState(1);
  const [combatLog, setCombatLog] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  
  const [activeEnemyAction, setActiveEnemyAction] = useState(null);
  const [actionQueue, setActionQueue] = useState([]);
  const [craftingOptions, setCraftingOptions] = useState(null);
  const [cardSelection, setCardSelection] = useState(null);
  const [tempSelection, setTempSelection] = useState([]);

  const [previewCard, setPreviewCard] = useState(null);

  const [draftSelections, setDraftSelections] = useState({skill:null, power:null});
  const [notifications, setNotifications] = useState([]);
  
  const [showEquipment, setShowEquipment] = useState(false);
  
  const [viewingPile, setViewingPile] = useState(null);

  const interactionLock = useRef(false);

  const addNotification = (message, type) => {
      const id = Date.now() + Math.random();
      setNotifications(prev => [...prev, { id, message, type }]);
  };

  const dismissNotification = (id) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- HELPER RENDER ---
  const renderStatusIcons = (statuses) => {
      if (!statuses) return null;
      return (
          <div className="flex gap-1 flex-wrap">
              {Object.entries(statuses).map(([key, val]) => {
                  if (val <= 0) return null;
                  return (
                      <div key={key} className="relative group cursor-help">
                          <div className="bg-slate-800 p-1 rounded border border-slate-600">
                             {ICONS[key] || <Info className="w-4 h-4"/>}
                          </div>
                          <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-slate-600">
                              {val}
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black border border-slate-600 rounded text-xs text-white z-50 hidden group-hover:block">
                              {key}: {KEYWORDS[key]}
                          </div>
                      </div>
                  );
              })}
          </div>
      );
  };

  const startGame = () => {
    if (gameMode === 'CLASSIC') setCustomEnemies([]);

    const starterDeck = [];
    const baseAttack = COMMON_CRUSADER_CARDS.find(c => c.id === 'strike');
    const selectedSkill = draftSelections.skill;
    const selectedPower = draftSelections.power;

    if (baseAttack && selectedSkill && selectedPower) {
        for(let i=0; i<6; i++) starterDeck.push({...baseAttack, id: `atk_${i}`});
        for(let i=0; i<3; i++) starterDeck.push({...selectedSkill, id: `skl_${i}`});
        starterDeck.push({...selectedPower, id: `pwr_${0}`});
        
        setDeck(starterDeck);
        startEncounter(1, starterDeck);
    }
  };

  const handleBalanceModeSetup = () => {
      setGameMode('BALANCE');
      setScreen('BALANCE_SETUP');
      setCustomEnemies([]);
  };

  const startCustomEncounter = () => {
      const starterDeck = [];
      const baseAttack = COMMON_CRUSADER_CARDS.find(c => c.id === 'strike');
      
      const selectedSkill = draftSelections.skill;
      const selectedPower = draftSelections.power;

      if (baseAttack && selectedSkill && selectedPower) {
          for(let i=0; i<6; i++) starterDeck.push({...baseAttack, id: `atk_${i}`});
          for(let i=0; i<3; i++) starterDeck.push({...selectedSkill, id: `skl_${i}`});
          starterDeck.push({...selectedPower, id: `pwr_${0}`});
          
          setDeck(starterDeck);
          startEncounter(1, starterDeck);
      }
  };

  const startEncounter = (currentStep, overrideDeck) => {
    setStep(currentStep);
    
    const minionsB = Object.values(MINIONS_DB).filter(e => e.grade === EnemyGrade.B);
    const minionsA = Object.values(MINIONS_DB).filter(e => e.grade === EnemyGrade.A);
    const minionsS = Object.values(MINIONS_DB).filter(e => e.grade === EnemyGrade.S);

    const getRandom = (list) => {
        if (list.length === 0) return minionsB[0]; 
        return list[Math.floor(Math.random() * list.length)];
    };
    
    const createEnemy = (template, uid) => JSON.parse(JSON.stringify({...template, id: uid, usedMoveIds: []}));

    let enemyPool = [];

    if (gameMode === 'BALANCE') {
        enemyPool = customEnemies.map((e, i) => createEnemy(e, `custom_e${i}`));
    } else {
        if (currentStep <= 3) {
            enemyPool = [createEnemy(getRandom(minionsB), 'e1')];
        } else if (currentStep <= 6) {
            enemyPool = [
                createEnemy(getRandom(minionsB), 'e1'),
                createEnemy(getRandom(minionsA), 'e2')
            ];
        } else if (currentStep <= 9) {
            if (Math.random() > 0.5) {
                 enemyPool = [createEnemy(getRandom(minionsS), 'e1')];
            } else {
                 enemyPool = [
                    createEnemy(getRandom(minionsA), 'e1'),
                    createEnemy(getRandom(minionsB), 'e2'),
                    createEnemy(getRandom(minionsB), 'e3')
                ];
            }
        } else {
          enemyPool = [createEnemy(minionsS[0], 'boss_placeholder')];
        }
    }

    let p;

    if (overrideDeck) {
        const shuffledDeck = [...overrideDeck].sort(() => Math.random() - 0.5);
        p = {
            id: 'player', name: 'Crusader', maxHealth: 75, currentHealth: 75,
            block: 0, effects: {}, isEnemy: false,
            energy: 3, maxEnergy: 3,
            deck: overrideDeck,
            hand: [], discardPile: [], drawPile: shuffledDeck,
            subclass: subclass, passives: [], equipment: [],
            costModifiers: []
        };

        if (subclass === 'KNIGHT') p.equipment = ['greathelm', 'rusty_mail', 'shortsword', 'kite_shield'];
        else if (subclass === 'ZEALOT') p.equipment = ['greathelm', 'rusty_mail', 'greatsword', 'locked'];
        else p.equipment = ['greathelm', 'rusty_mail', 'morningstar', 'scriptures'];

        if (p.equipment.includes('rusty_mail')) { p.maxHealth += 10; p.currentHealth += 10; }
    } else {
        if (!player) return;
        p = {
            ...player,
            block: 0,
            effects: {}, 
            energy: 3,
            hand: [], discardPile: [],
            drawPile: [...deck].sort(() => Math.random() - 0.5),
            costModifiers: []
        };
    }

    if (p.equipment.includes('greathelm')) applyStatus({player: p, enemies: enemyPool}, p, StatusEffect.PROTECTION, 1, []);
    
    if (p.equipment.includes('kite_shield')) {
        for(let i=0; i<4; i++) p.drawPile.push({...TOKEN_CARDS['shield_block'], id: `tok_sh_${i}`});
        p.drawPile.sort(() => Math.random() - 0.5);
    }
    if (p.equipment.includes('greatsword')) {
        for(let i=0; i<4; i++) p.drawPile.push({...TOKEN_CARDS['cleave'], id: `tok_cl_${i}`});
        p.drawPile.sort(() => Math.random() - 0.5);
    }

    if (p.currentHealth > p.maxHealth) p.currentHealth = p.maxHealth;

    const initialHand = [];
    const initialDrawPile = [...p.drawPile];
    for(let i=0; i<5; i++) {
      if (initialDrawPile.length > 0) initialHand.push(initialDrawPile.pop());
    }
    p.hand = initialHand;
    p.drawPile = initialDrawPile;

    enemyPool.forEach(e => updateEnemyIntent(e, 1, p));

    setPlayer(p);
    setEnemies(enemyPool);
    setTurn(1);
    setCombatLog(['Encounter Started!']);
    setScreen('COMBAT');
  };

  const updateEnemyIntent = (enemy, turnNum, p) => {
    let move;
    const ratio = enemy.currentHealth / enemy.maxHealth;
    
    if (ratio < 0.3 && enemy.lastResortCooldown <= 0) {
      move = enemy.moves.find(m => m.category === EnemyMoveCategory.LAST_RESORT);
      if (move) {
        enemy.hasUsedLastResort = true;
        enemy.lastResortCooldown = move.cooldown !== undefined ? move.cooldown : 99;
        enemy.nextMove = move;
        return;
      }
    } 
    
    const isTacticTurn = (turnNum % 3 === 2);

    const getValidMove = (cat) => {
        return enemy.moves.find(m => m.category === cat && (!m.oneUse || !enemy.usedMoveIds?.includes(m.id)));
    };

    if (isTacticTurn) {
        move = getValidMove(EnemyMoveCategory.TACTIC);
        if (!move) move = getValidMove(EnemyMoveCategory.BASE);
    } else {
        move = getValidMove(EnemyMoveCategory.BASE);
        if (!move) move = getValidMove(EnemyMoveCategory.TACTIC);
    }
    
    if (!move) {
      const opts = enemy.moves.filter(m => m.category !== EnemyMoveCategory.LAST_RESORT);
      move = opts[Math.floor(Math.random() * opts.length)];
    }
    
    enemy.nextMove = move;
  };

  const playCard = (card, targetId) => {
    if (interactionLock.current) return;
    if (!player || activeEnemyAction) return;
    
    if (!player.hand.find(c => c.id === card.id)) return;

    const actualCost = getCardCost(card, player);
    if (player.energy < actualCost) return;
    
    if (card.name === 'Battle Trance') {
         const otherCards = player.hand.filter(c => c.id !== card.id);
         const hasNonAttack = otherCards.some(c => c.type !== CardType.ATTACK);
         if (hasNonAttack) {
             addNotification("Battle Trance requires only Attacks in hand!", 'info');
             return;
         }
    }

    if (player.effects[StatusEffect.ENTANGLED] && card.type === CardType.ATTACK) {
        const isRanged = card.description.includes("Ranged") || card.ranged;
        if (!isRanged) {
            addNotification("Entangled! Cannot play non-Ranged Attacks.", 'info');
            return;
        }
    }

    setNotifications([]);

    interactionLock.current = true;
    setTimeout(() => { interactionLock.current = false; }, 250);

    const newPlayer = { 
        ...player,
        hand: [...player.hand],
        drawPile: [...player.drawPile],
        discardPile: [...player.discardPile],
        effects: {...player.effects}
    };
    
    newPlayer.energy -= actualCost;

    if ((newPlayer.effects[StatusEffect.POISON] || 0) > 0) {
        const poisonDmg = newPlayer.effects[StatusEffect.POISON];
        newPlayer.currentHealth -= poisonDmg;
        addNotification(`Player took ${poisonDmg} Poison damage!`, 'damage');
        
        if (!newPlayer.effects[StatusEffect.BLIGHTED]) {
            const currentStacks = newPlayer.effects[StatusEffect.POISON];
            const newStacks = currentStacks - 1;
            if (newStacks <= 0) {
                delete newPlayer.effects[StatusEffect.POISON];
            } else {
                newPlayer.effects[StatusEffect.POISON] = newStacks;
            }
        }

        if (newPlayer.currentHealth <= 0) {
             setPlayer(newPlayer);
             setScreen('GAMEOVER');
             return;
        }
    }

    const g = { player: newPlayer, enemies: [...enemies] };
    const logs = [];
    
    if (card.baseDamage) {
        const target = targetId ? getEnemy(g, targetId) : enemies[0]; 
        if (card.target === CardTarget.ALL) {
            g.enemies.forEach(e => dealDamage(g, newPlayer, e, card.baseDamage, logs));
        } else {
            dealDamage(g, newPlayer, target, card.baseDamage, logs);
        }
    }
    if (card.baseBlock) {
        let block = card.baseBlock;
        if (player.effects[StatusEffect.TENACITY]) {
             block += player.effects[StatusEffect.TENACITY];
        }
        newPlayer.block += block;
        logs.push(`Gained ${block} Block`);
    }
    
    let selectionRequest = null;
    if (card.effect) {
        const result = card.effect(g, targetId, logs, card); 
        if (result) {
            if (result.action === 'CRAFT') {
                setCraftingOptions(result.options);
            } else if (result.action === 'SELECT') {
                selectionRequest = result;
            }
        }
    }

    newPlayer.hand = newPlayer.hand.filter(c => c.id !== card.id);
    
    if (card.volatile || card.type === CardType.TRAP) {
        logs.push(`${card.name} burned (Exhausted)`);
    } else {
        newPlayer.discardPile.push(card);
    }

    if (card.cardClass.includes(ClassTag.HOLY) || card.cardClass.includes(ClassTag[subclass])) {
        applyStatus(g, newPlayer, StatusEffect.HOLY_FERVOR, 1, logs);
    }

    const deadEnemies = g.enemies.filter(e => e.currentHealth <= 0);
    if (deadEnemies.length > 0) {
        g.enemies.forEach(survivor => {
            if (survivor.currentHealth > 0 && survivor.moves.some(m => m.mechanic && m.mechanic.triggerCondition === 'OnAllyDeath')) {
                applyStatus(g, survivor, StatusEffect.AUGMENT, 6, logs);
                survivor.block += 6;
                logs.push(`${survivor.name} gained 6 Augment & 6 Block (Fire Ritual)`);
            }
        });
    }

    setPlayer(newPlayer);
    setSelectedCard(null);

    if (selectionRequest) {
        let candidates = [];
        if (selectionRequest.source === 'DISCARD') {
            candidates = newPlayer.discardPile.filter(selectionRequest.filter);
        } else if (selectionRequest.source === 'HAND') {
            candidates = newPlayer.hand.filter(selectionRequest.filter);
        }

        if (candidates.length === 0) {
            addNotification("No valid targets for selection.", 'info');
        } else if (candidates.length <= selectionRequest.count) {
            const autoLog = [];
            selectionRequest.logic({ player: newPlayer, enemies }, candidates, autoLog);
            autoLog.forEach(l => addNotification(l, 'info'));
            setPlayer({...newPlayer}); 
        } else {
            setCardSelection({
                ...selectionRequest,
                candidates: candidates
            });
            setTempSelection([]);
        }
    }

    const updatedEnemies = g.enemies.filter(e => e.currentHealth > 0);
    updatedEnemies.forEach(e => {
        const ratio = e.currentHealth / e.maxHealth;
        if (ratio <= 0.3 && e.lastResortCooldown <= 0) {
            const lrMove = e.moves.find(m => m.category === EnemyMoveCategory.LAST_RESORT);
            if (lrMove && e.nextMove?.id !== lrMove.id) {
                 e.nextMove = lrMove;
                 e.hasUsedLastResort = true;
                 e.lastResortCooldown = lrMove.cooldown !== undefined ? lrMove.cooldown : 99;
            }
        }
    });

    setEnemies(updatedEnemies); 
    
    if (g.enemies.every(e => e.currentHealth <= 0)) {
      setPlayer(newPlayer);
      if (gameMode === 'BALANCE') {
          setTimeout(() => setScreen('BALANCE_VICTORY'), 1000);
      } else {
          setTimeout(() => setScreen('REWARD'), 1000);
      }
    }
  };

  const handleSelectionComplete = () => {
      if (!cardSelection || !player) return;
      
      const selectedCards = cardSelection.candidates.filter(c => tempSelection.includes(c.id));
      const newPlayer = { ...player }; 
      const logs = [];
      
      cardSelection.logic({ player: newPlayer, enemies }, selectedCards, logs);
      
      logs.forEach(l => addNotification(l, 'info'));
      setPlayer(newPlayer);
      setCardSelection(null);
      setTempSelection([]);
  };

  const handleCraftSelection = (card) => {
      if (!player) return;
      const newPlayer = { ...player };
      const newCard = { ...card, id: `${card.id}_${Date.now()}` };
      newPlayer.drawPile.push(newCard);
      newPlayer.drawPile.sort(() => Math.random() - 0.5);
      setPlayer(newPlayer);
      setCraftingOptions(null);
      setCombatLog(prev => [...prev, `Crafted ${card.name} and shuffled into deck.`]);
  };

  const startEnemyPhase = () => {
    if (interactionLock.current) return;
    if (!player) return;

    setNotifications([]);

    interactionLock.current = true;
    setTimeout(() => { interactionLock.current = false; }, 250);

    const newPlayer = { 
        ...player,
        hand: [...player.hand],
        discardPile: [...player.discardPile]
    };
    
    const retainedCards = newPlayer.hand.filter(c => c.retain);
    const cardsToDiscard = newPlayer.hand.filter(c => !c.retain);

    if (subclass === 'KNIGHT') {
        const blockGain = cardsToDiscard.length;
        if (blockGain > 0) {
            newPlayer.block += blockGain;
        }
    }

    cardsToDiscard.forEach(card => {
        if (card.volatile) {
            addNotification(`${card.name} (Volatile) Exhausted!`, 'info');
        } else {
            newPlayer.discardPile.push(card);
        }
    });

    newPlayer.hand = retainedCards; 
    
    if (newPlayer.effects[StatusEffect.ENTANGLED]) {
        newPlayer.effects[StatusEffect.ENTANGLED]--;
        if (newPlayer.effects[StatusEffect.ENTANGLED] <= 0) delete newPlayer.effects[StatusEffect.ENTANGLED];
    }

    setPlayer(newPlayer);

    const queue = enemies.map(e => ({ enemyId: e.id, move: e.nextMove }));
    setActionQueue(queue);
    processNextAction(queue, newPlayer, enemies);
  };

  const processNextAction = (currentQueue, currentPlayer, currentEnemies) => {
      if (currentQueue.length === 0) {
          startPlayerTurn(currentPlayer, currentEnemies);
          return;
      }

      const { enemyId, move } = currentQueue[0];
      const enemy = currentEnemies.find(e => e.id === enemyId);

      if (!enemy || enemy.currentHealth <= 0) {
          processNextAction(currentQueue.slice(1), currentPlayer, currentEnemies);
          return;
      }
      
      const newPlayer = { ...currentPlayer };
      const newEnemies = [...currentEnemies];
      const activeEnemy = newEnemies.find(e => e.id === enemyId);
      
      const currentActionLogs = []; 
      
      const g = { player: newPlayer, enemies: newEnemies };

      if (move.oneUse) {
          activeEnemy.usedMoveIds = activeEnemy.usedMoveIds || [];
          activeEnemy.usedMoveIds.push(move.id);
      }

      if ((activeEnemy.effects[StatusEffect.POISON] || 0) > 0) {
          const poisonDmg = activeEnemy.effects[StatusEffect.POISON];
          activeEnemy.currentHealth -= poisonDmg;
          currentActionLogs.push(`${activeEnemy.name} took ${poisonDmg} Poison damage!`);
          
          if (!activeEnemy.effects[StatusEffect.BLIGHTED]) {
              const currentStacks = activeEnemy.effects[StatusEffect.POISON];
              const newStacks = currentStacks - 1;
              if (newStacks <= 0) {
                  delete activeEnemy.effects[StatusEffect.POISON];
              } else {
                  activeEnemy.effects[StatusEffect.POISON] = newStacks;
              }
          }
      }

      let finalDamage = move.damage || 0;
      
      if (move.statusScaling === ScalingFactor.AUGMENT) {
          finalDamage += (activeEnemy.effects[StatusEffect.AUGMENT] || 0);
      }
      
      if (move.damageScaling === ScalingFactor.CURRENT_HP) {
          finalDamage = activeEnemy.currentHealth * 2;
      }
      else if (move.damageScaling === ScalingFactor.TARGET_DISCARD_PILE_COUNT) {
          finalDamage = newPlayer.discardPile.length;
      }

      if (finalDamage > 0) {
          dealDamage(g, activeEnemy, newPlayer, finalDamage, currentActionLogs);
      }

      if (move.statusEffects) {
          move.statusEffects.forEach(eff => {
             if (eff.status === StatusEffect.BLOCK) {
                 activeEnemy.block += eff.amount;
                 currentActionLogs.push(`${activeEnemy.name} gained ${eff.amount} Block`);
             }
             else if (eff.status === StatusEffect.BURN && move.statusScaling === ScalingFactor.AUGMENT) {
                 const amount = (activeEnemy.effects[StatusEffect.AUGMENT] || 0);
                 if (amount > 0) {
                     applyStatus(g, newPlayer, StatusEffect.BURN, amount, currentActionLogs);
                 } else {
                     currentActionLogs.push(`${activeEnemy.name}'s Dragonfire fizzles (0 Augment)`);
                 }
             }
             else if (eff.status === StatusEffect.EVASION || eff.status === StatusEffect.BLOODTHIRST || eff.status === StatusEffect.RAGE || eff.status === StatusEffect.AUGMENT) {
                 applyStatus(g, activeEnemy, eff.status, eff.amount, currentActionLogs);
             }
             else applyStatus(g, newPlayer, eff.status, eff.amount, currentActionLogs);
          });
      }
      
      if (move.mechanic && move.mechanic.modifyPlayerCost) {
          const mod = move.mechanic.modifyPlayerCost;
          newPlayer.costModifiers.push({ 
              amount: mod.amount, 
              durationTurns: mod.durationTurns, 
              cardType: mod.cardType 
          });
          currentActionLogs.push(`Player Attacks cost +${mod.amount} next turn!`);
      }

      if (move.mechanic && move.mechanic.restoreHp) {
          let healAmount = 0;
          if (move.mechanic.restoreHp.type === 'Fixed') healAmount = move.mechanic.restoreHp.amount || 0;
          else if (move.mechanic.restoreHp.type === 'DamageDealt') healAmount = move.damage || 0;
          
          if (healAmount > 0) healUnit(activeEnemy, healAmount, currentActionLogs);
      }
      
      if (move.mechanic && move.mechanic.burnCards) {
            const { source, count } = move.mechanic.burnCards;
            if (source === 'DiscardPile') {
                for(let i=0; i<count; i++) {
                    if (newPlayer.discardPile.length > 0) {
                        const idx = Math.floor(Math.random() * newPlayer.discardPile.length);
                        const burned = newPlayer.discardPile.splice(idx, 1)[0];
                        currentActionLogs.push(`Gobbled (Exhausted): ${burned.name}`);
                    }
                }
            }
      }

      if (move.mechanic && move.mechanic.addCardToDiscard) {
            const { cardId, count } = move.mechanic.addCardToDiscard;
            const template = TOKEN_CARDS[cardId];
            
            if (template) {
                for(let i=0; i<count; i++) {
                    const newCard = { ...template, id: `${cardId}_${Date.now()}_${i}` };
                    newPlayer.discardPile.push(newCard);
                    currentActionLogs.push(`Added ${template.name} to Discard Pile`);
                }
            }
      }

      if (move.mechanic && move.mechanic.mill) {
          const { count } = move.mechanic.mill;
          const milledCards = [];
          
          for(let i=0; i<count; i++) {
              if (newPlayer.drawPile.length === 0) {
                  if (newPlayer.discardPile.length === 0) break;
                  newPlayer.drawPile = [...newPlayer.discardPile].sort(() => Math.random() - 0.5);
                  newPlayer.discardPile = [];
              }
              
              const card = newPlayer.drawPile.pop();
              if (card) {
                  newPlayer.discardPile.push(card);
                  milledCards.push(card.name);
              }
          }
          
          if (milledCards.length > 0) {
              currentActionLogs.push(`Milled: ${milledCards.join(', ')}`);
          }
      }
      
      if (move.mechanic && move.mechanic.dealDamageToSelf && move.mechanic.dealDamageToSelf.type === 'CurrentHP') {
            const selfDmg = activeEnemy.currentHealth;
            activeEnemy.currentHealth = 0;
            currentActionLogs.push(`${activeEnemy.name} sacrifices itself!`);
      }

      if (move.mechanic && move.mechanic.executeMoves) {
          const movesToExec = move.mechanic.executeMoves; 
          const extraActions = movesToExec.map(mid => {
              const moveDef = activeEnemy.moves.find(m => m.id === mid);
              return moveDef ? { enemyId: activeEnemy.id, move: moveDef } : null;
          }).filter(Boolean);

          if (extraActions.length > 0) {
              const nextQueue = currentQueue.slice(1);
              const newQueue = [...extraActions, ...nextQueue];
              
              setActionQueue([currentQueue[0], ...extraActions, ...currentQueue.slice(1)]);
          }
      }


      if (activeEnemy.lastResortCooldown > 0) activeEnemy.lastResortCooldown--;

      setPlayer(newPlayer);
      setEnemies(newEnemies.filter(e => e.currentHealth > 0)); 
      
      setActiveEnemyAction({
          enemyName: activeEnemy.name,
          moveName: move.name,
          description: move.description,
          events: currentActionLogs
      });
      
      if (!move.mechanic?.executeMoves) {
          setActionQueue(currentQueue);
      }
  };

  const handleDismissAction = () => {
      // Safety check for empty queue
      if (!activeEnemyAction && actionQueue.length === 0) return;

      if (activeEnemyAction && activeEnemyAction.events.length > 0) {
          activeEnemyAction.events.forEach(msg => {
              let type = 'info';
              if (msg.includes('damage')) type = 'damage';
              else if (msg.includes('Block') || msg.includes('Protection')) type = 'block';
              else if (msg.includes('Applied') || msg.includes('Enraged')) type = 'status';
              else if (msg.includes('healed')) type = 'heal';
              
              addNotification(msg, type);
          });
      }
      
      const nextQueue = actionQueue.slice(1);
      setActionQueue(nextQueue);
      setActiveEnemyAction(null);
      processNextAction(nextQueue, player, enemies);
  };

  const startPlayerTurn = (p, es) => {
    // IMPORTANT: Deep copy arrays to ensure React sees the state update
    const newPlayer = { 
        ...p,
        hand: [...p.hand],
        drawPile: [...p.drawPile],
        discardPile: [...p.discardPile],
        effects: {...p.effects}
    };
    const newEnemies = [...es]; 

    newPlayer.block = 0;
    newPlayer.energy = newPlayer.maxEnergy;
    
    let drawCount = 5 + (newPlayer.effects[StatusEffect.WISDOM] || 0);
    
    if (newPlayer.effects[StatusEffect.DAZED]) {
        const dazedAmount = newPlayer.effects[StatusEffect.DAZED];
        drawCount -= dazedAmount;
        addNotification(`Dazed: Drew ${dazedAmount} less cards!`, 'status');
        delete newPlayer.effects[StatusEffect.DAZED]; 
    }
    
    drawCount = Math.max(0, drawCount); 
    
    drawCards({player: newPlayer}, drawCount);

    const bindingTraps = newPlayer.hand.filter(c => c.id.includes('binding_trap'));
    if (bindingTraps.length > 0) {
        bindingTraps.forEach(() => {
             const discardableIndices = newPlayer.hand.map((c, i) => i).filter(i => !newPlayer.hand[i].id.includes('binding_trap'));
             
             if (discardableIndices.length > 0) {
                 const randIdx = discardableIndices[Math.floor(Math.random() * discardableIndices.length)];
                 const discarded = newPlayer.hand.splice(randIdx, 1)[0];
                 
                 if (discarded.volatile) {
                     addNotification(`Binding Trap: ${discarded.name} (Volatile) Exhausted!`, 'damage');
                 } else {
                     newPlayer.discardPile.push(discarded);
                     addNotification(`Binding Trap discarded ${discarded.name}!`, 'damage');
                 }
             }
        });
    }
    
    if (newPlayer.effects[StatusEffect.RECKLESS] && newPlayer.hand.length > 0) {
        const cardToPlay = newPlayer.hand[0];
        const baseCost = getCardCost(cardToPlay, newPlayer);
        const reducedCost = Math.max(0, baseCost - 1);
        
        if (newPlayer.energy >= reducedCost) {
             newPlayer.energy -= reducedCost;
             const logs = [`Reckless Nature played ${cardToPlay.name}`];
             
             const g = { player: newPlayer, enemies: newEnemies };
             
             if (cardToPlay.baseDamage) {
                 const target = newEnemies.length > 0 ? newEnemies[Math.floor(Math.random() * newEnemies.length)] : null;
                 if (target) {
                     if (cardToPlay.target === CardTarget.ALL) {
                        newEnemies.forEach(e => dealDamage(g, newPlayer, e, cardToPlay.baseDamage, logs));
                     } else {
                        dealDamage(g, newPlayer, target, cardToPlay.baseDamage, logs);
                     }
                 }
             }
             if (cardToPlay.baseBlock) {
                 let b = cardToPlay.baseBlock;
                 if (newPlayer.effects[StatusEffect.TENACITY]) b += newPlayer.effects[StatusEffect.TENACITY];
                 newPlayer.block += b;
                 logs.push(`Gained ${b} Block`);
             }
             if (cardToPlay.effect) {
                 cardToPlay.effect(g, undefined, logs, cardToPlay); 
             }

             newPlayer.hand.shift(); 
             newPlayer.discardPile.push(cardToPlay);
             
             logs.forEach(l => addNotification(l, 'info'));
        }
    }

    newPlayer.costModifiers = newPlayer.costModifiers
        .map(mod => ({ ...mod, durationTurns: mod.durationTurns - 1 }))
        .filter(mod => mod.durationTurns >= 0); 
    
    [newPlayer, ...newEnemies].forEach(u => {
        if (u.effects[StatusEffect.BURN]) {
            u.effects[StatusEffect.BURN]--;
            if(u.effects[StatusEffect.BURN] <= 0) delete u.effects[StatusEffect.BURN];
        }
        if (u.effects[StatusEffect.BLEED]) {
            const bleedDmg = u.effects[StatusEffect.BLEED];
            u.currentHealth -= bleedDmg;
            addNotification(`${u.name} took ${bleedDmg} Bleed damage!`, 'damage');
        }
    });

    if (newEnemies.every(e => e.currentHealth <= 0)) {
        setPlayer(newPlayer);
        setEnemies(newEnemies);
        if (gameMode === 'BALANCE') {
            setTimeout(() => setScreen('BALANCE_VICTORY'), 1000);
        } else {
            setTimeout(() => setScreen('REWARD'), 1000);
        }
        return;
    }

    const aliveEnemies = newEnemies.filter(e => e.currentHealth > 0);

    aliveEnemies.forEach(e => updateEnemyIntent(e, turn + 1, newPlayer));

    setPlayer(newPlayer);
    setEnemies(aliveEnemies);
    setTurn(turn + 1);

    if (newPlayer.currentHealth <= 0) {
        setScreen('GAMEOVER');
    }
  };

  const openDrawPile = () => {
      if (!player) return;
      const sorted = [...player.drawPile].sort((a, b) => a.name.localeCompare(b.name));
      setViewingPile({title: 'Draw Pile', cards: sorted});
  };

  const openDiscardPile = () => {
      if (!player) return;
      const sorted = [...player.discardPile].sort((a, b) => a.name.localeCompare(b.name));
      setViewingPile({title: 'Discard Pile', cards: sorted});
  };

  // --- RENDERERS ---

  if (screen === 'INTRO') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-8 text-center">
        <div className="max-w-2xl space-y-8 animate-fade-in">
          <h1 className="text-6xl font-bold text-red-600 font-serif">The Dragon Must Die</h1>
          <p className="text-xl text-slate-300">
            The Kingdom has fallen. The Ancient Dragon nests in the castle, 
            and its corruption seeps into the land.
          </p>
          <p className="text-xl text-slate-300">
            Only a hero alone will rise.
          </p>
          <button 
            onClick={() => setScreen('CLASS_SELECT')}
            className="px-8 py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded text-xl transition-all flex items-center mx-auto gap-2"
          >
            <Play size={24} /> CLICK TO START
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'CLASS_SELECT') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8">
        <h2 className="text-4xl font-serif mb-12 text-center">Choose Your Class</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div onClick={() => setScreen('SUBCLASS_SELECT')} className="w-64 h-96 bg-slate-800 border-2 border-yellow-500 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center">
            <Shield className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-center mb-2">Crusader</h3>
            <p className="text-slate-400 text-center">Durable, Melee, Divine.</p>
          </div>
          <div className="w-64 h-96 bg-slate-800 border-2 border-slate-700 rounded-lg p-6 opacity-50 cursor-not-allowed grayscale flex flex-col items-center justify-center">
            <Ghost className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-center mb-2">Scoundrel</h3>
            <p className="text-slate-400 text-center">Disabled</p>
          </div>
          <div className="w-64 h-96 bg-slate-800 border-2 border-slate-700 rounded-lg p-6 opacity-50 cursor-not-allowed grayscale flex flex-col items-center justify-center">
            <Zap className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-center mb-2">Magus</h3>
            <p className="text-slate-400 text-center">Disabled</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'SUBCLASS_SELECT') {
    const subclasses = [
      { id: 'KNIGHT', name: 'The Knight', icon: <Shield />, desc: 'Focus on mitigation and heavy armor.', passive: 'Bulwark of Faith: Gain 1 Block per card discarded at end of turn.' },
      { id: 'ZEALOT', name: 'The Zealot', icon: <Flame />, desc: 'Focus on AoE and Lifevamp.', passive: 'Bloodlust: Heal 3 HP & Gain 1 Energy on Kill.' },
      { id: 'INQUISITOR', name: 'The Inquisitor', icon: <BookOpen />, desc: 'Focus on Debuffs and Truth.', passive: 'Anathema: Enemy Debuffs cannot be cleansed.' },
    ];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8">
        <h2 className="text-4xl font-serif mb-12 text-center">Choose Subclass</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {subclasses.map(sub => (
            <div key={sub.id} onClick={() => { setSubclass(sub.id); setScreen('EQUIPMENT'); }} className="w-72 bg-slate-800 border border-slate-600 hover:border-yellow-500 rounded-lg p-6 cursor-pointer transition-all flex flex-col">
              <div className="text-yellow-500 mb-4 flex justify-center">{sub.icon}</div>
              <h3 className="text-2xl font-bold text-center mb-2">{sub.name}</h3>
              <p className="text-sm text-slate-300 mb-4 text-center flex-grow">{sub.desc}</p>
              <div className="bg-slate-900 p-3 rounded text-xs text-slate-400 border border-slate-700">
                <span className="text-yellow-500 font-bold">Passive:</span> <KeywordText text={sub.passive} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'EQUIPMENT') {
    const loadout = {
      head: EQUIPMENT_DB['greathelm'],
      body: EQUIPMENT_DB['rusty_mail'],
      main: subclass === 'KNIGHT' ? EQUIPMENT_DB['shortsword'] 
            : subclass === 'ZEALOT' ? EQUIPMENT_DB['greatsword']
            : EQUIPMENT_DB['morningstar'],
      off: subclass === 'KNIGHT' ? EQUIPMENT_DB['kite_shield']
           : subclass === 'ZEALOT' ? EQUIPMENT_DB['locked']
           : EQUIPMENT_DB['scriptures']
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8">
        <h2 className="text-3xl font-serif mb-8 text-center">Equipment Loadout</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full max-w-3xl place-items-center">
          <div className="flex items-start gap-4 bg-slate-800 p-4 rounded w-full max-w-sm border border-slate-700">
            <div className="flex-shrink-0"><User className="mt-1 text-yellow-500" /></div>
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">HEAD</div>
                <div className="font-bold text-lg">{loadout.head.name}</div>
                <div className="text-xs text-slate-300 mt-1"><KeywordText text={loadout.head.desc} /></div>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-slate-800 p-4 rounded w-full max-w-sm border border-slate-700">
            <div className="flex-shrink-0"><ShirtIcon className="mt-1 text-yellow-500" /></div>
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">BODY</div>
                <div className="font-bold text-lg">{loadout.body.name}</div>
                <div className="text-xs text-slate-300 mt-1"><KeywordText text={loadout.body.desc} /></div>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-slate-800 p-4 rounded w-full max-w-sm border border-slate-700">
            <div className="flex-shrink-0"><Sword className="mt-1 text-yellow-500" /></div>
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">MAIN HAND</div>
                <div className="font-bold text-lg">{loadout.main.name}</div>
                <div className="text-xs text-slate-300 mt-1"><KeywordText text={loadout.main.desc} /></div>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-slate-800 p-4 rounded w-full max-w-sm border border-slate-700">
            <div className="flex-shrink-0"><Shield className="mt-1 text-yellow-500" /></div>
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">OFF HAND</div>
                <div className="font-bold text-lg">{loadout.off.name}</div>
                <div className="text-xs text-slate-300 mt-1"><KeywordText text={loadout.off.desc} /></div>
            </div>
          </div>
        </div>
        <button onClick={() => setScreen('DRAFT')} className="px-8 py-3 bg-blue-700 hover:bg-blue-600 rounded font-bold shadow-lg w-full max-w-sm md:w-auto">Confirm Loadout</button>
      </div>
    );
  }

  if (screen === 'DRAFT') {
    const draftSkills = [
        COMMON_CRUSADER_CARDS.find(c => c.id === 'warcry'),
        COMMON_CRUSADER_CARDS.find(c => c.id === 'draw_steel'),
        COMMON_CRUSADER_CARDS.find(c => c.id === 'at_ready'),
    ].filter(Boolean);
    
    const draftPowers = [
        COMMON_CRUSADER_CARDS.find(c => c.id === 'iron_will'),
        COMMON_CRUSADER_CARDS.find(c => c.id === 'reckless_nature'),
        COMMON_CRUSADER_CARDS.find(c => c.id === 'weapon_master'),
    ].filter(Boolean);

    const isReady = draftSelections.skill && draftSelections.power;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8 relative">
        <button 
          disabled={!isReady}
          onClick={() => { setGameMode('CLASSIC'); startGame(); }} 
          className="fixed bottom-20 right-6 z-50 md:absolute md:top-8 md:right-8 md:bottom-auto px-6 py-3 md:px-8 md:py-3 bg-green-700 hover:bg-green-600 disabled:bg-slate-700 disabled:cursor-not-allowed rounded font-bold text-lg shadow-lg flex items-center gap-2 transition-all"
        >
          Classic Mode <ArrowRight size={20} />
        </button>

        <button 
          disabled={!isReady}
          onClick={handleBalanceModeSetup}
          className="fixed bottom-6 right-6 z-50 md:absolute md:top-24 md:right-8 md:bottom-auto px-6 py-3 md:px-8 md:py-3 bg-purple-700 hover:bg-purple-600 disabled:bg-slate-700 disabled:cursor-not-allowed rounded font-bold text-lg shadow-lg flex items-center gap-2 transition-all"
        >
          Balance Mode <Sword size={20} />
        </button>

        <h2 className="text-3xl font-serif mb-2 mt-4 md:mt-0 text-center">Draft Starting Deck</h2>
        <p className="text-slate-400 mb-8 md:mb-12 text-center">Base Attack (x6 Strike) included automatically.</p>
        
        <div className="flex flex-col gap-12 w-full max-w-5xl justify-center items-center pb-24 md:pb-0">
          
          <div className="w-full">
            <h3 className="text-center font-bold text-blue-400 uppercase tracking-widest text-sm mb-6">Select Innate Skill (x3)</h3>
            <div className="flex justify-center gap-6">
                {draftSkills.map(card => (
                  <div key={card.id} className="cursor-pointer hover:scale-105 transition-transform" onClick={() => setDraftSelections(prev => ({...prev, skill: card}))}>
                      <CardView card={card} selected={draftSelections.skill?.id === card.id} onLongPress={setPreviewCard} />
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-center font-bold text-yellow-400 uppercase tracking-widest text-sm mb-6">Select Innate Power (x1)</h3>
             <div className="flex justify-center gap-6">
                {draftPowers.map(card => (
                  <div key={card.id} className="cursor-pointer hover:scale-105 transition-transform" onClick={() => setDraftSelections(prev => ({...prev, power: card}))}>
                      <CardView card={card} selected={draftSelections.power?.id === card.id} onLongPress={setPreviewCard} />
                  </div>
                ))}
            </div>
          </div>

        </div>
        
        {previewCard && <CardPreviewOverlay card={previewCard} onClose={() => setPreviewCard(null)} />}
      </div>
    );
  }

  if (screen === 'BALANCE_SETUP') {
      const availableMinions = Object.values(MINIONS_DB);

      return (
          <div className="flex flex-col items-center min-h-screen bg-slate-900 text-white p-8">
              <h2 className="text-3xl font-serif text-purple-400 mb-4">Balance Mode Setup</h2>
              <p className="text-slate-400 mb-8">Create a custom encounter. (Max 5 minions)</p>

              <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl flex-1 overflow-hidden">
                  
                  <div className="flex-1 bg-slate-800 p-4 rounded-xl border border-slate-700 overflow-y-auto h-[60vh]">
                      <h3 className="font-bold text-lg mb-4 sticky top-0 bg-slate-800 py-2 border-b border-slate-600">Available Minions</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {availableMinions.map(minion => (
                              <div key={minion.id} 
                                   onClick={() => {
                                       if (customEnemies.length < 5) {
                                           setCustomEnemies([...customEnemies, minion]);
                                       } else {
                                           addNotification("Max 5 minions allowed!", "info");
                                       }
                                   }}
                                   className="bg-slate-700 p-2 rounded cursor-pointer hover:bg-slate-600 hover:scale-105 transition-all border border-slate-600 flex flex-col items-center">
                                  <Skull className="w-8 h-8 mb-2 text-red-400" />
                                  <div className="font-bold text-sm text-center">{minion.name}</div>
                                  <div className="text-xs text-slate-400">{minion.grade}-Tier</div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="w-full md:w-1/3 bg-purple-900/20 p-4 rounded-xl border border-purple-500 flex flex-col">
                      <h3 className="font-bold text-lg mb-4 text-purple-300">Encounter Team ({customEnemies.length}/5)</h3>
                      <div className="flex-1 space-y-2 overflow-y-auto mb-4">
                          {customEnemies.length === 0 && <div className="text-slate-500 text-center italic mt-10">Select minions to add them here...</div>}
                          {customEnemies.map((enemy, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-600">
                                  <span className="font-bold text-sm">{enemy.name}</span>
                                  <button 
                                    onClick={() => {
                                        const newEnemies = [...customEnemies];
                                        newEnemies.splice(idx, 1);
                                        setCustomEnemies(newEnemies);
                                    }}
                                    className="text-red-400 hover:text-red-200"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          ))}
                      </div>
                      
                      <div className="flex gap-2">
                          <button 
                            onClick={() => setScreen('DRAFT')}
                            className="flex-1 py-3 border border-slate-500 rounded hover:bg-slate-700 font-bold text-slate-300"
                          >
                              Cancel
                          </button>
                          <button 
                            disabled={customEnemies.length === 0}
                            onClick={startCustomEncounter}
                            className="flex-[2] py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded font-bold text-white shadow-lg"
                          >
                              Confirm Fight
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  if (screen === 'COMBAT') {
    return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      
      {/* NOTIFICATIONS */}
      <div className="absolute top-24 right-4 flex flex-col gap-2 z-[60] pointer-events-none items-end">
            {notifications.map(n => (
                <div key={n.id} className={`pointer-events-auto flex items-center justify-between w-56 p-2 rounded shadow-lg animate-in slide-in-from-right fade-in duration-200 
                    ${n.type === 'damage' ? 'bg-red-900 border border-red-600' : 
                      n.type === 'block' ? 'bg-blue-900 border border-blue-600' : 
                      n.type === 'heal' ? 'bg-green-900 border border-green-600' : 
                      n.type === 'status' ? 'bg-purple-900 border border-purple-600' : 'bg-slate-800 border border-slate-600'}`}>
                    <span className="text-xs font-bold">{n.message}</span>
                    <button onClick={() => dismissNotification(n.id)} className="ml-2 hover:text-red-400"><X size={14}/></button>
                </div>
            ))}
      </div>

      {/* MODALS */}
      {viewingPile !== null && (
            <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in p-8">
                <div className="w-full max-w-5xl h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-serif text-yellow-500">{viewingPile.title} ({viewingPile.cards.length})</h2>
                        <button onClick={() => setViewingPile(null)}><X className="text-slate-400 hover:text-white" size={32}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 border border-slate-700 rounded bg-slate-900/50 justify-items-center">
                        {viewingPile.cards.map((c, i) => (
                             <div key={i} className="scale-90 origin-top"><CardView card={c} playable={false} onLongPress={setPreviewCard} /></div>
                        ))}
                    </div>
                </div>
            </div>
      )}
      {showEquipment && player && (
            <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in p-4">
                <div className="bg-slate-800 p-6 md:p-8 rounded-xl border-2 border-slate-600 max-w-2xl w-full relative">
                    <button onClick={() => setShowEquipment(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
                    <h2 className="text-2xl md:text-3xl font-serif mb-6 md:mb-8 text-center text-yellow-500">Active Equipment</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {player.equipment.map(eqId => {
                            const item = EQUIPMENT_DB[eqId];
                            if (!item) return null;
                            return (
                                <div key={eqId} className="flex items-start gap-3 bg-slate-900 p-3 md:p-4 rounded border border-slate-700">
                                    <div className="font-bold text-sm md:text-base">{item.name}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
      )}
      {/* SELECTION OVERLAYS */}
      {cardSelection && (
            <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in p-8">
                <div className="w-full max-w-5xl flex flex-col items-center">
                    <h2 className="text-2xl md:text-4xl font-serif text-yellow-400 mb-4 text-center">{cardSelection.title}</h2>
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {cardSelection.candidates.map(card => {
                            const isSelected = tempSelection.includes(card.id);
                            return (
                                <div key={card.id} onClick={() => {
                                    if (isSelected) {
                                        setTempSelection(prev => prev.filter(id => id !== card.id));
                                    } else if (tempSelection.length < cardSelection.count) {
                                        setTempSelection(prev => [...prev, card.id]);
                                    }
                                }} className={`cursor-pointer transition-transform hover:scale-105 scale-90 md:scale-100 relative`}>
                                    <CardView card={card} selected={isSelected} />
                                    {isSelected && <div className="absolute inset-0 flex items-center justify-center bg-yellow-500/30 rounded-xl"><Check className="text-white w-12 h-12 drop-shadow-lg" /></div>}
                                </div>
                            );
                        })}
                    </div>
                    <button 
                        disabled={tempSelection.length !== cardSelection.count}
                        onClick={handleSelectionComplete}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded text-xl transition-all flex items-center gap-2"
                    >
                        Confirm Selection <Check />
                    </button>
                </div>
            </div>
      )}
      
      {/* ENEMY ACTION OVERLAY */}
        {activeEnemyAction && (
            <div className="absolute inset-0 bg-black/60 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300 p-4">
                <div className="bg-red-950 border-4 border-red-600 rounded-xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-center relative">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{activeEnemyAction.enemyName}</h2>
                    <div className="text-lg md:text-xl text-red-300 mb-6">uses <span className="font-bold text-white">{activeEnemyAction.moveName}</span></div>
                    
                    <div className="bg-black/40 p-4 rounded-lg border border-red-800 text-base md:text-lg text-slate-200 mb-8">
                        <KeywordText text={activeEnemyAction.description} />
                    </div>

                    <button 
                        onClick={handleDismissAction}
                        className="mx-auto flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-lg transition-colors"
                    >
                        <X size={24} /> DISMISS
                    </button>
                </div>
            </div>
        )}

      {/* HEADER */}
      <div className="h-14 md:h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-2 md:px-4 shadow-lg z-10">
          <div className="flex items-center gap-2 md:gap-4">
              <div className="flex flex-col">
                  <span className="hidden md:block text-xs text-slate-400 uppercase tracking-widest font-bold">Player</span>
                  <span className="font-bold text-sm md:text-lg flex items-center gap-2">
                      <User className="w-3 h-3 md:w-4 md:h-4" /> {player.name}
                  </span>
              </div>
              <div className="h-6 md:h-8 w-px bg-slate-700 mx-1 md:mx-2"></div>
              <div className="flex items-center gap-2 md:gap-6">
                  <div className="flex items-center gap-1 md:gap-2 text-red-400" title="Health">
                      <Heart className="w-3 h-3 md:w-5 md:h-5 fill-current" />
                      <span className="font-mono text-sm md:text-xl font-bold">{player.currentHealth}/{player.maxHealth}</span>
                  </div>
                  {/* Block removed from Header to simplify HUD */}
                  <div className="flex items-center gap-1 md:gap-2 text-cyan-400" title="Mana">
                      <div className="relative">
                        <Zap className="w-4 h-4 md:w-6 md:h-6 fill-current animate-pulse" />
                      </div>
                      <span className="font-mono text-sm md:text-xl font-bold">{player.energy}/{player.maxEnergy}</span>
                  </div>
              </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             <div className="text-right hidden md:block">
                 <div className="text-xs text-slate-500 uppercase">Turn</div>
                 <div className="font-mono text-xl font-bold">{turn}</div>
             </div>
             <div className="h-6 md:h-8 w-px bg-slate-700 mx-1 md:mx-2"></div>
             
             <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors" onClick={() => setShowEquipment(true)}>
                <Package size={16} className="md:w-5 md:h-5"/>
                <span className="text-[8px] md:text-[10px] uppercase">Equip</span>
             </div>

             <div className="flex flex-col items-end cursor-pointer hover:text-white" onClick={openDrawPile}>
                 <div className="hidden md:block text-xs text-slate-500 uppercase">Deck</div>
                 <div className="flex items-center gap-1 text-slate-300">
                     <Layers className="w-4 h-4" /> {player.drawPile.length}
                 </div>
             </div>
             <div className="flex flex-col items-end cursor-pointer hover:text-white" onClick={openDiscardPile}>
                 <div className="hidden md:block text-xs text-slate-500 uppercase">Discard</div>
                 <div className="flex items-center gap-1 text-slate-300">
                     <Trash2 className="w-4 h-4" /> {player.discardPile.length}
                 </div>
             </div>
          </div>
      </div>

      {/* BATTLEFIELD */}
      <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-4">
          
          {/* Background Decor */}
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600 blur-3xl rounded-full mix-blend-screen"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 blur-3xl rounded-full mix-blend-screen"></div>
          </div>

          {/* Player Status Display (Floating) */}
          <div className="absolute bottom-4 left-4 flex gap-2 items-end z-30">
              {/* Dynamic Block Icon - Only shows when Block > 0 */}
              {player.block > 0 && (
                  <div className="relative group cursor-help animate-in zoom-in duration-200">
                      <div className="bg-slate-800 p-1.5 rounded-lg border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                         <Shield className="w-5 h-5 text-blue-400 fill-blue-400/20"/>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-blue-900 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-blue-500 shadow-sm">
                          {player.block}
                      </div>
                       <div className="absolute bottom-full left-0 mb-2 w-max px-2 py-1 bg-black border border-blue-500 rounded text-xs text-blue-100 hidden group-hover:block z-50 shadow-xl text-left">
                          Block {player.block}
                      </div>
                  </div>
              )}
              {renderStatusIcons(player.effects)}
          </div>

          {/* Enemies */}
          <div className="flex gap-8 z-10">
              {enemies.map(enemy => (
                  <div key={enemy.id} 
                       onClick={() => selectedCard && selectedCard.target === CardTarget.SINGLE && playCard(selectedCard, enemy.id)}
                       className={`relative w-48 flex flex-col items-center gap-2 group transition-all duration-300 hover:scale-105 ${selectedCard && selectedCard.target === CardTarget.SINGLE ? 'cursor-crosshair ring-2 ring-red-500 rounded-lg p-1' : ''}`}>
                      
                      {/* Intent */}
                      <div className="absolute -top-12 animate-bounce">
                          <div className="bg-slate-800 text-white px-3 py-1 rounded-full border border-slate-600 shadow-xl flex items-center gap-2 text-sm font-bold">
                              {enemy.nextMove?.intentType === IntentType.ATTACK && <Sword className="w-4 h-4 text-red-400"/>}
                              {enemy.nextMove?.intentType === IntentType.BUFF && <ArrowRight className="w-4 h-4 text-green-400 rotate-[-45deg]"/>}
                              {enemy.nextMove?.intentType === IntentType.DEBUFF && <Skull className="w-4 h-4 text-purple-400"/>}
                              {enemy.nextMove?.intentType === IntentType.DEFEND && <Shield className="w-4 h-4 text-blue-400"/>}
                              {enemy.nextMove?.damage > 0 && <span>{enemy.nextMove.damage}</span>}
                          </div>
                      </div>

                      {/* Sprite Placeholder */}
                      <div className="w-32 h-32 bg-slate-800 rounded-lg border-2 border-slate-700 shadow-2xl flex items-center justify-center relative overflow-hidden group-hover:border-slate-500 transition-colors">
                          <Ghost className="w-16 h-16 text-slate-600" />
                          <div className="absolute bottom-0 w-full h-1 bg-slate-700">
                              <div 
                                className="h-full bg-red-600 transition-all duration-500" 
                                style={{ width: `${(enemy.currentHealth / enemy.maxHealth) * 100}%` }}
                              ></div>
                          </div>
                      </div>

                      {/* Stats */}
                      <div className="text-center w-full">
                          <div className="font-bold text-lg text-slate-200">{enemy.name}</div>
                          <div className="flex justify-center gap-3 mt-1">
                                <div className="flex items-center gap-1 text-red-400 font-bold bg-slate-900/50 px-2 py-0.5 rounded">
                                    <Heart className="w-3 h-3 fill-current" /> {enemy.currentHealth}
                                </div>
                                {enemy.block > 0 && (
                                    <div className="flex items-center gap-1 text-blue-400 font-bold bg-slate-900/50 px-2 py-0.5 rounded">
                                            <Shield className="w-3 h-3 fill-current" /> {enemy.block}
                                    </div>
                                )}
                          </div>
                          {/* Enemy Statuses */}
                          <div className="flex justify-center mt-2 gap-1">
                              {renderStatusIcons(enemy.effects)}
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Log / Notifications (Simple) */}
          <div className="absolute top-4 right-4 w-64 h-32 overflow-hidden pointer-events-none flex flex-col justify-end gap-1 opacity-70">
              {combatLog.slice(-3).map((l, i) => (
                  <div key={i} className="text-xs text-right bg-slate-900/80 p-1 rounded text-slate-300 animate-fade-in">
                      {l}
                  </div>
              ))}
          </div>

      </div>

      {/* HAND AREA */}
      <div className="h-48 md:h-56 bg-slate-900 border-t border-slate-800 relative flex items-end justify-center pb-2 md:pb-4 gap-2 px-2 md:px-4 z-20">
          
          {/* End Turn Button */}
          <div className="absolute top-0 right-4 -translate-y-1/2">
              <button 
                onClick={startEnemyPhase}
                className={`
                    px-6 py-3 rounded-lg font-bold shadow-xl border-b-4 transition-all active:border-b-0 active:translate-y-1
                    bg-amber-500 border-amber-700 hover:bg-amber-400 text-slate-900
                `}
              >
                  End Turn
              </button>
          </div>

          {/* Cards */}
          <div className="flex items-end justify-center -space-x-6 md:-space-x-4 hover:space-x-1 transition-all duration-300 perspective-1000 w-full px-2 md:px-12">
            {player.hand.map((card, index) => {
               const canPlay = player.energy >= getCardCost(card, player);
               const isSelected = selectedCard === card;
               
               // Card Rotation Logic for fan effect
               const total = player.hand.length;
               const rotate = (index - (total - 1) / 2) * 5;
               const translateY = Math.abs(index - (total - 1) / 2) * 10;

               return (
                <div 
                    key={index}
                    onClick={() => card.target === CardTarget.SINGLE ? setSelectedCard(selectedCard === card ? null : card) : playCard(card)}
                    style={{ 
                        transform: isSelected ? 'translateY(-40px) scale(1.1) rotate(0deg)' : `rotate(${rotate}deg) translateY(${translateY}px)`,
                        zIndex: isSelected ? 50 : index,
                        transformOrigin: 'bottom center'
                    }}
                    className={`
                        transition-all duration-200 cursor-pointer
                        hover:-translate-y-12 hover:rotate-0 hover:z-50 hover:scale-110
                    `}
                >
                    <CardView 
                        card={card} 
                        playable={canPlay} 
                        costDisplay={getCardCost(card, player)}
                        selected={isSelected}
                    />
                </div>
               );
            })}
          </div>
      </div>
    </div>
    );
  }

  if (screen === 'REWARD') {
    const rewardPool = COMMON_CRUSADER_CARDS.filter(c => c.id !== 'strike');
    
    const common = rewardPool[Math.floor(Math.random() * rewardPool.length)];
    const common2 = rewardPool[Math.floor(Math.random() * rewardPool.length)];
    const subPool = subclass === 'KNIGHT' ? KNIGHT_CARDS : subclass === 'ZEALOT' ? ZEALOT_CARDS : INQUISITOR_CARDS;
    const sub = subPool[Math.floor(Math.random() * subPool.length)];
    const rewards = [common, common2, sub];

    const pickReward = (card) => {
        const newCard = { ...card, id: `${card.id}_${Date.now()}` };
        const newDeck = [...deck, newCard];
        setDeck(newDeck);
        startEncounter(step + 1);
    };

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <h2 className="text-4xl font-bold text-yellow-500 mb-4">Victory!</h2>
        
        {previewCard && <CardPreviewOverlay card={previewCard} onClose={() => setPreviewCard(null)} />}

        <p className="mb-8 text-slate-400">Choose a card to add to your deck</p>
        <div className="flex gap-8">
            {rewards.map((c, i) => (
                <div key={i} className="cursor-pointer hover:scale-105 transition-transform">
                    <CardView card={c} onClick={() => pickReward(c)} onLongPress={setPreviewCard} />
                </div>
            ))}
        </div>
      </div>
    );
  }

  if (screen === 'BALANCE_VICTORY') {
      return (
      <div className="flex flex-col items-center justify-center h-screen bg-purple-900 text-white">
        <h2 className="text-6xl font-serif font-bold text-yellow-400 mb-4">Victory!</h2>
        <p className="mb-12 text-purple-200 text-xl">Balance test concluded successfully.</p>
        
        <button 
            onClick={() => setScreen('CLASS_SELECT')} 
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-500 rounded text-xl font-bold flex items-center gap-2 transition-all"
        >
            <ChevronRight className="rotate-180" /> Go Back
        </button>
      </div>
    );
  }

  if (screen === 'GAMEOVER') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-red-600">
        <h1 className="text-8xl font-bold font-serif mb-4">YOU DIED</h1>
        <p className="text-white text-xl mb-8">The Dragon remains undefeated.</p>
        <button onClick={() => setScreen('CLASS_SELECT')} className="px-8 py-3 border border-red-600 text-red-600 hover:bg-red-900 rounded text-xl">
            Try Again
        </button>
      </div>
    );
  }

  return <div>Loading...</div>;
}

// --- UI COMPONENTS ---

const KeywordText = ({ text }) => {
  const parts = text.split(/(\b(?:Block|Vulnerable|Weak|Strength|Bleed|Poison|Burn|Evasion|Holy Fervor|Stun|Dazed|Tenacity|Protection|Innate|Volatile|Retain|Ranged|Exhaust|Mill|Augment|Dispel|Thorns|Rage|Bloodthirst|Entangled|Blighted|Lifevamp|Regen|Gestating|Debuff|Reckless|Weapon Mastery)\b)/gi);
  
  return (
    <span>
      {parts.map((part, i) => {
        const key = Object.keys(KEYWORDS).find(k => k.toLowerCase() === part.toLowerCase());
        if (key) {
          return (
            <span key={i} className="font-bold text-yellow-400 cursor-help relative group">
              {part}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black border border-slate-600 rounded text-xs text-white font-normal hidden group-hover:block z-50 shadow-xl text-left">
                <span className="block font-bold text-yellow-500 mb-1">{key}</span>
                {KEYWORDS[key]}
              </span>
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};

const CardPreviewOverlay = ({ card, onClose }) => {
    if (!card) return null;

    const foundKeywords = [];
    if (card.description) {
        const matches = card.description.match(KEYWORD_REGEX);
        if (matches) {
            matches.forEach(m => {
                const key = Object.keys(KEYWORDS).find(k => k.toLowerCase() === m.toLowerCase());
                if (key && !foundKeywords.includes(key)) foundKeywords.push(key);
            });
        }
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="scale-150 mb-8 pointer-events-none">
                <CardView card={card} playable={true} />
            </div>
            
            <div className="w-full max-w-md space-y-4">
                <div className="text-center text-slate-400 text-sm animate-pulse mb-4">Tap anywhere to close</div>
                
                {foundKeywords.length > 0 ? (
                    <div className="space-y-3">
                        {foundKeywords.map(key => (
                            <div key={key} className="bg-slate-800 border border-slate-600 rounded p-3">
                                <div className="text-yellow-500 font-bold mb-1">{key}</div>
                                <div className="text-white text-sm">{KEYWORDS[key]}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 italic">No special keywords.</div>
                )}
            </div>
        </div>
    );
};

const CardView = ({ card, selected, playable = true, costDisplay, onClick, onLongPress, onLongPressEnd }: any) => {
  const border = card.rarity === CardRarity.COMMON ? 'border-slate-600' : card.rarity === CardRarity.TOKEN ? 'border-yellow-200' : 'border-purple-500/50';
  const displayCost = costDisplay !== undefined ? costDisplay : card.cost;
  const costColor = displayCost > card.cost ? 'bg-red-600' : displayCost < card.cost ? 'bg-green-600' : 'bg-blue-600';

  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  const handleStart = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if (onLongPress) onLongPress(card);
    }, 500); 
  };

  const handleEnd = (e) => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
    if (isLongPress.current) {
       if (e.cancelable) e.preventDefault();
       if (onLongPressEnd) onLongPressEnd();
    }
  };

  const handleClick = (e) => {
      if (isLongPress.current) {
          e.stopPropagation();
          return;
      }
      if (onClick) onClick();
  };

  return (
    <div 
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }} 
      className={`
        w-20 md:w-40 aspect-[2/3] rounded-xl border-2 shadow-2xl flex flex-col p-2 select-none relative
        bg-gradient-to-br from-slate-800 to-slate-900
        ${border}
        ${!playable ? 'opacity-60 grayscale-[0.5]' : ''}
        ${selected ? 'ring-4 ring-yellow-400 border-yellow-400' : ''}
        ${playable && !selected ? 'hover:border-yellow-400 hover:shadow-yellow-400/20' : ''}
      `}
    >
      {/* Header: Cost & Name */}
      <div className="flex justify-between items-start mb-1">
          <div className={`${costColor} text-white w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-lg shadow-md border border-blue-400 relative z-10 -ml-1 -mt-1`}>
              {displayCost}
          </div>
          <div className="text-[8px] md:text-xs font-bold text-slate-200 text-right leading-tight max-w-[70%]">
              {card.name}
          </div>
      </div>
      
      {/* Art Placeholder */}
      <div className="flex-1 bg-slate-950 rounded border border-slate-800 mb-2 relative overflow-hidden flex items-center justify-center transition-colors">
        {card.type === CardType.ATTACK ? <Sword className="w-3 h-3 md:w-12 md:h-12 text-red-500/80" /> : card.type === CardType.SKILL ? <Shield className="w-3 h-3 md:w-12 md:h-12 text-blue-500/80" /> : <Zap className="w-3 h-3 md:w-12 md:h-12 text-yellow-500/80" />}
        
        {/* Type Icon Corner */}
        <div className="absolute bottom-1 right-1 text-slate-600">
            {card.type === CardType.ATTACK ? <Sword className="w-3 h-3 md:w-5 md:h-5" /> : card.type === CardType.SKILL ? <Zap className="w-3 h-3 md:w-5 md:h-5" /> : card.type === CardType.TRAP ? <Anchor className="w-3 h-3 md:w-5 md:h-5" /> : <RefreshCw className="w-3 h-3 md:w-5 md:h-5" />}
        </div>
      </div>
      
      {/* Description */}
      <div className="text-[6px] md:text-[10px] text-center text-slate-300 leading-tight h-8 md:h-12 relative flex items-center justify-center">
        <KeywordText text={card.description} />
      </div>

      {/* Classes */}
      <div className="flex justify-center gap-1 flex-wrap mb-1 px-1">
          {card.cardClass?.map((c, i) => (
              <span key={i} className="text-[5px] md:text-[6px] uppercase font-bold text-slate-400 bg-slate-900/50 px-1 rounded">
                  {c}
              </span>
          ))}
      </div>
      
      {/* Footer */}
      <div className="mt-auto pt-1 text-[5px] md:text-[8px] text-center text-slate-500 font-mono uppercase truncate border-t border-slate-800/50">
        {card.type} - {card.rarity}
      </div>
    </div>
  );
};

function ShirtIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
}