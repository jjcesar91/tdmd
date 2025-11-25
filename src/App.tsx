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
  CONFUSION: 'Confusion',
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
    StatusEffect.CONFUSION,
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
  "Confusion": "Draw X less cards at the start of next turn.",
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
  "Bloodthirst": "Gain 1 Strength when target gains Bleed.",
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

// Helper to make card creation cleaner
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
const applyStatus = (target, status, amount, logs = []) => {
  if (!target) return;
  // Protection Logic
  if (target.effects[StatusEffect.PROTECTION] && DEBUFFS.includes(status)) {
    target.effects[StatusEffect.PROTECTION]--;
    logs.push(`${target.name}: Protection negated ${status}!`);
    if (target.effects[StatusEffect.PROTECTION] <= 0) delete target.effects[StatusEffect.PROTECTION];
    return; // Blocked
  }
  
  target.effects[status] = (target.effects[status] || 0) + amount;
  logs.push(`${target.name}: +${amount} ${status}`);
};

const drawCards = (g, count) => {
  for (let i = 0; i < count; i++) {
    if (g.player.drawPile.length === 0) {
      if (g.player.discardPile.length === 0) break;
      // Shuffle discard into draw
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
  
  // Weapon Mastery Check
  const masteryMultiplier = (source.effects[StatusEffect.WEAPON_MASTERY] || 0) + 1;

  // Apply Equipment Logic (Shortsword)
  if (!source.isEnemy && source.equipment.includes('shortsword')) {
      dmg += (1 * masteryMultiplier);
  }

  if (source.effects[StatusEffect.WEAK]) dmg = Math.floor(dmg * 0.75);
  if (target.effects[StatusEffect.VULNERABLE]) dmg = Math.floor(dmg * 1.5);
  
  // Evasion Logic
  if (target.effects[StatusEffect.EVASION]) {
    target.effects[StatusEffect.EVASION]--;
    logs.push(`${target.name}: Dodged attack with Evasion!`);
    if (target.effects[StatusEffect.EVASION] <= 0) delete target.effects[StatusEffect.EVASION];
    return 0; // Miss
  }
  
  // Apply Equipment On Hit (Morningstar)
  if (!source.isEnemy && source.equipment.includes('morningstar')) {
      // Apply X times based on Mastery
      for(let i=0; i<masteryMultiplier; i++) {
         if (Math.random() > 0.5) applyStatus(target, StatusEffect.BLEED, 1, logs);
      }
  }

  // Block logic
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
    
    // Trigger Rage
    if (target.effects[StatusEffect.RAGE]) {
        applyStatus(target, StatusEffect.STRENGTH, 1, logs);
        logs.push(`${target.name} is Enraged!`);
    }
  }
  return unblockedDmg;
};

const BLESSING_CARDS = [
  createCard({ id: 'samson', name: "Samson's Strength", type: CardType.SKILL, rarity: CardRarity.TOKEN, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY, ClassTag.BLESSING], target: CardTarget.SELF, description: 'Gain 2 Strength.', effect: (g, tid, logs) => applyStatus(g.player, StatusEffect.STRENGTH, 2, logs) }),
  createCard({ id: 'david', name: "King David's Courage", type: CardType.SKILL, rarity: CardRarity.TOKEN, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY, ClassTag.BLESSING], target: CardTarget.SELF, description: 'Random card in hand costs 0.', effect: (g, tid, logs, src) => { 
      const valid = g.player.hand.filter(c => c.id !== src.id);
      if(valid.length > 0) { 
          const c = valid[Math.floor(Math.random()*valid.length)]; 
          c.cost = 0; 
          if(logs) logs.push(`${c.name} costs 0`); 
      } 
  } }), 
  createCard({ id: 'solomon', name: "Solomon's Wisdom", type: CardType.POWER, rarity: CardRarity.TOKEN, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY, ClassTag.BLESSING], target: CardTarget.SELF, description: 'Draw +1 card each turn.', effect: (g, tid, logs) => applyStatus(g.player, StatusEffect.WISDOM, 1, logs) }) 
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
  createCard({ id: 'warcry', name: 'Warcry', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Gain 1 Strength.', effect: (g, tid, logs) => applyStatus(g.player, StatusEffect.STRENGTH, 1, logs) }),
  createCard({ id: 'bash', name: 'Bash', type: CardType.ATTACK, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SINGLE, description: 'Deal 8 Damage. Apply 2 Vulnerable.', baseDamage: 8, effect: (g, tid, logs) => applyStatus(getEnemy(g, tid), StatusEffect.VULNERABLE, 2, logs) }),
  createCard({ id: 'draw_steel', name: 'Draw Steel', type: CardType.SKILL, cost: 0, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Discard 1 random card. Draw 1 Attack.', effect: (g, tid, logs, src) => { 
      const valid = g.player.hand.filter(c => c.id !== src.id);
      if (valid.length > 0) {
        const discardIdx = Math.floor(Math.random() * valid.length);
        const target = valid[discardIdx];
        const realIdx = g.player.hand.findIndex(c => c.id === target.id);
        if (realIdx > -1) g.player.discardPile.push(g.player.hand.splice(realIdx, 1)[0]);
      }
      const atk = g.player.drawPile.find((c) => c.type === CardType.ATTACK);
      if (atk) {
         g.player.drawPile = g.player.drawPile.filter((c) => c !== atk);
         g.player.hand.push(atk);
      }
  }}),
  // UPDATED: At Ready - Triggers Selection UI
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
                 // Filter out the selected cards from discard pile
                 gState.player.discardPile = gState.player.discardPile.filter(c => !selectedCards.some(s => s.id === c.id));
                 // Add them to draw pile
                 gState.player.drawPile.push(...selectedCards);
                 // Shuffle
                 gState.player.drawPile.sort(() => Math.random() - 0.5);
                 currentLogs.push(`Shuffled ${selectedCards.map(c => c.name).join(', ')} into deck.`);
             }
         };
      }
  }),
  createCard({ id: 'divine_ward', name: 'Divine Ward', type: CardType.SKILL, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SELF, description: 'Gain 2 Protection.', effect: (g, tid, logs) => applyStatus(g.player, StatusEffect.PROTECTION, 2, logs) }),
  createCard({ id: 'holy_smite', name: 'Holy Smite', type: CardType.ATTACK, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SINGLE, description: 'Deal dmg equal to Holy Fervor.', baseDamage: 0, effect: (g, tid, logs) => { const dmg = g.player.effects[StatusEffect.HOLY_FERVOR] || 0; dealDamage(g, g.player, getEnemy(g, tid), dmg, logs || []); g.player.effects[StatusEffect.HOLY_FERVOR] = 0; } }),
  // UPDATED: Battle Trance
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
          // The check is done in playCard before execution.
          g.player.energy += 2; 
          logs.push("Battle Trance grants 2 Energy.");
      }
  }), 
  createCard({ id: 'iron_will', name: 'Iron Will', type: CardType.POWER, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Gain 2 Tenacity.', effect: (g, tid, logs) => applyStatus(g.player, StatusEffect.TENACITY, 2, logs) }),
  createCard({ id: 'reckless_nature', name: 'Reckless Nature', type: CardType.POWER, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Start of Turn: Play first drawn card for -1 Energy.', effect: (g, tid, logs) => applyStatus(g.player, StatusEffect.RECKLESS, 1, logs) }),
  createCard({ id: 'weapon_master', name: 'Weapon Master', type: CardType.POWER, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SELF, description: 'Doubles Main/Off Hand passive effects.', effect: (g, tid, logs) => applyStatus(g.player, StatusEffect.WEAPON_MASTERY, 1, logs) }),
  createCard({ id: 'pray', name: 'Pray', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SELF, description: 'Craft 1 Blessing and shuffle into deck.', effect: (g) => { return { action: 'CRAFT', options: BLESSING_CARDS }; } }),
  createCard({ id: 'in_nomine', name: 'In nomine patris', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SELF, description: 'Volatile. Discard 1. Draw 1 Holy.', volatile: true, effect: (g, tid, logs, src) => {
      const valid = g.player.hand.filter(c => c.id !== src.id);
      if (valid.length > 0) {
        const discardIdx = Math.floor(Math.random() * valid.length);
        const target = valid[discardIdx];
        const realIdx = g.player.hand.findIndex(c => c.id === target.id);
        if (realIdx > -1) g.player.discardPile.push(g.player.hand.splice(realIdx, 1)[0]);
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
          g.player.discardPile.push(holyInHand);
      }
      const holyCount = g.player.discardPile.filter((c) => c.cardClass.includes(ClassTag.HOLY)).length;
      dealDamage(g, g.player, getEnemy(g, tid), holyCount * 5, logs || []);
  }}),
  createCard({ id: 'bigger_they_are', name: 'The Bigger They Are', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER], target: CardTarget.SINGLE, description: 'Apply 2 Weak. Shuffle "Harder They Fall" into deck.', effect: (g, tid, logs) => {
      applyStatus(getEnemy(g, tid), StatusEffect.WEAK, 2, logs);
      g.player.drawPile.push({...COMMON_CRUSADER_CARDS.find(c => c.id === 'harder_fall'), id: `gen_${Date.now()}`});
      g.player.drawPile.sort(() => Math.random() - 0.5);
  }}),
  createCard({ id: 'our_father', name: 'Our Father...', type: CardType.SKILL, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.CRUSADER, ClassTag.HOLY], target: CardTarget.SELF, description: 'Volatile. Double Holy Fervor.', volatile: true, effect: (g, tid, logs) => {
      const current = g.player.effects[StatusEffect.HOLY_FERVOR] || 0;
      applyStatus(g.player, StatusEffect.HOLY_FERVOR, current, logs);
  }})
];

const KNIGHT_CARDS = [
  createCard({ id: 'shield_block', name: 'Shield Block', type: CardType.SKILL, rarity: CardRarity.COMMON, cardClass: [ClassTag.KNIGHT], target: CardTarget.SELF, description: 'Gain 6 Block. Draw 1.', baseBlock: 6, effect: (g) => drawCards(g, 1) }),
  createCard({ id: 'shield_bash', name: 'Shield Bash', type: CardType.ATTACK, rarity: CardRarity.COMMON, cardClass: [ClassTag.KNIGHT], target: CardTarget.SINGLE, description: 'Deal Dmg equal to Block.', baseDamage: 0, effect: (g, tid, logs) => dealDamage(g, g.player, getEnemy(g, tid), g.player.block, logs || []) }),
  // UPDATED: Hold Fast - Uses Selection
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
                    // Must find the card instance in the new hand state
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
  createCard({ id: 'condemn', name: 'Condemn', type: CardType.SKILL, cost: 2, rarity: CardRarity.COMMON, cardClass: [ClassTag.INQUISITOR], target: CardTarget.SINGLE, description: 'Apply 2 Weak.', effect: (g, tid, logs) => applyStatus(getEnemy(g, tid), StatusEffect.WEAK, 2, logs) }),
  createCard({ id: 'flail', name: 'Flail', type: CardType.ATTACK, rarity: CardRarity.COMMON, cardClass: [ClassTag.INQUISITOR], target: CardTarget.SINGLE, description: 'Deal 4 Dmg. Apply 1 Bleed.', baseDamage: 4, effect: (g, tid, logs) => applyStatus(getEnemy(g, tid), StatusEffect.BLEED, 1, logs) }),
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
      { id: 'bite', name: 'Venomous Bite', description: '5 Dmg + 2 Poison', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 5, statusEffects: [{status: StatusEffect.POISON, amount: 2, target: 'Player'}] },
      { id: 'web', name: 'Spit Web', description: 'Apply Entangled', category: EnemyMoveCategory.TACTIC, intentType: IntentType.DEBUFF, statusEffects: [{status: StatusEffect.ENTANGLED, amount: 1, target: 'Player'}] },
      { id: 'cocoon', name: 'Web Cocoon', description: 'Gain 10 Block', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.DEFEND, cooldown: 2, statusEffects: [{status: StatusEffect.BLOCK, amount: 10}] } 
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
      { id: 'anti', name: 'Anti-Voodoo', description: '1 Evasion + 1 Protection', category: EnemyMoveCategory.BASE, intentType: IntentType.BUFF, statusEffects: [{status: StatusEffect.EVASION, amount: 1}, {status: StatusEffect.PROTECTION, amount: 1}] },
      { id: 'ritual', name: 'Fire Ritual', description: 'Buffs on Ally Death', category: EnemyMoveCategory.TACTIC, intentType: IntentType.BUFF, mechanic: { triggerCondition: 'OnAllyDeath' } }, 
      { id: 'evoke', name: 'Evoke Dragonfire', description: '6 Dmg + Burn', category: EnemyMoveCategory.LAST_RESORT, intentType: IntentType.ATTACK, damage: 6, cooldown: 2, statusEffects: [{status: StatusEffect.BURNING, amount: 0, target: 'Player'}], statusScaling: ScalingFactor.AUGMENT }
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
      // Updated: Added mechanic to Mill
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
      { id: 'maul', name: 'Maul', description: '8 Dmg + Confusion', category: EnemyMoveCategory.BASE, intentType: IntentType.ATTACK, damage: 8, statusEffects: [{status: StatusEffect.CONFUSION, amount: 1, target: 'Player'}] },
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
    // Check for cost modifiers (e.g. from Frogman)
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

// --- COMPONENT ---

export default function GameDemo() {
  const [screen, setScreen] = useState('INTRO');
  const [subclass, setSubclass] = useState('');
  const [deck, setDeck] = useState([]);
  const [step, setStep] = useState(1);
  
  // Combat State
  const [player, setPlayer] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [turn, setTurn] = useState(1);
  const [combatLog, setCombatLog] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  
  const [activeEnemyAction, setActiveEnemyAction] = useState(null);
  const [actionQueue, setActionQueue] = useState([]);
  const [craftingOptions, setCraftingOptions] = useState(null);
  // New: Card Selection State
  const [cardSelection, setCardSelection] = useState(null);
  const [tempSelection, setTempSelection] = useState([]);

  // Updated draft selection state
  const [draftSelections, setDraftSelections] = useState({skill:null, power:null});
  const [notifications, setNotifications] = useState([]);
  
  const [showEquipment, setShowEquipment] = useState(false);
  
  // Pile View State
  const [viewingPile, setViewingPile] = useState(null);

  // Fix: Add Interaction Lock to prevent double-clicks/spam
  const interactionLock = useRef(false);

  // --- NOTIFICATION SYSTEM ---
  const addNotification = (message, type) => {
      const id = Date.now() + Math.random();
      setNotifications(prev => [...prev, { id, message, type }]);
  };

  const dismissNotification = (id) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- FLOW HANDLERS ---

  const startGame = () => {
    const starterDeck = [];
    const baseAttack = COMMON_CRUSADER_CARDS.find(c => c.id === 'strike');
    // Selections from Draft
    const selectedSkill = draftSelections.skill;
    const selectedPower = draftSelections.power;

    if (baseAttack && selectedSkill && selectedPower) {
        // Auto add 6 Strikes
        for(let i=0; i<6; i++) starterDeck.push({...baseAttack, id: `atk_${i}`});
        // Add 3x Selected Skill
        for(let i=0; i<3; i++) starterDeck.push({...selectedSkill, id: `skl_${i}`});
        // Add 1x Selected Power
        starterDeck.push({...selectedPower, id: `pwr_${0}`});
        
        setDeck(starterDeck);
        startEncounter(1, starterDeck);
    }
  };

  // ... (startEncounter same as before) ...
  const startEncounter = (currentStep, overrideDeck) => {
    setStep(currentStep);
    
    const minionsB = Object.values(MINIONS_DB).filter(e => e.grade === EnemyGrade.B);
    const minionsA = Object.values(MINIONS_DB).filter(e => e.grade === EnemyGrade.A);
    const minionsS = Object.values(MINIONS_DB).filter(e => e.grade === EnemyGrade.S);

    const getRandom = (list) => {
        if (list.length === 0) return minionsB[0]; 
        return list[Math.floor(Math.random() * list.length)];
    };
    
    const createEnemy = (template, uid) => JSON.parse(JSON.stringify({...template, id: uid}));

    let enemyPool = [];

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

    let p;

    if (overrideDeck) {
        // NEW GAME INIT
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

        // Apply Equipment Init (Only once)
        if (subclass === 'KNIGHT') p.equipment = ['greathelm', 'rusty_mail', 'shortsword', 'kite_shield'];
        else if (subclass === 'ZEALOT') p.equipment = ['greathelm', 'rusty_mail', 'greatsword', 'locked'];
        else p.equipment = ['greathelm', 'rusty_mail', 'morningstar', 'scriptures'];

        // Stat mods
        if (p.equipment.includes('rusty_mail')) { p.maxHealth += 10; p.currentHealth += 10; }
    } else {
        // CONTINUATION
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

    // START OF COMBAT EFFECTS (Applied fresh each combat)
    if (p.equipment.includes('greathelm')) applyStatus(p, StatusEffect.PROTECTION, 1, []);
    
    if (p.equipment.includes('kite_shield')) {
        for(let i=0; i<4; i++) p.drawPile.push({...TOKEN_CARDS['shield_block'], id: `tok_sh_${i}`});
        p.drawPile.sort(() => Math.random() - 0.5);
    }
    if (p.equipment.includes('greatsword')) {
        for(let i=0; i<4; i++) p.drawPile.push({...TOKEN_CARDS['cleave'], id: `tok_cl_${i}`});
        p.drawPile.sort(() => Math.random() - 0.5);
    }

    // Ensure HP doesn't exceed max
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

  // ... (updateEnemyIntent, playCard same as before) ...
  const updateEnemyIntent = (enemy, turnNum, p) => {
    let move;
    const ratio = enemy.currentHealth / enemy.maxHealth;
    
    if (ratio < 0.3 && !enemy.hasUsedLastResort && enemy.lastResortCooldown <= 0) {
      move = enemy.moves.find(m => m.category === EnemyMoveCategory.LAST_RESORT);
      enemy.hasUsedLastResort = true;
      enemy.lastResortCooldown = move.cooldown || 99;
    } else if (turnNum === 1) {
      move = enemy.moves.find(m => m.category === EnemyMoveCategory.BASE);
    } else if (ratio > 0.3 && turnNum === 2) {
      move = enemy.moves.find(m => m.category === EnemyMoveCategory.TACTIC);
    } else {
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
    
    // BATTLE TRANCE CHECK: Must have ONLY attacks in hand (excluding self)
    if (card.name === 'Battle Trance') {
         const otherCards = player.hand.filter(c => c.id !== card.id);
         const hasNonAttack = otherCards.some(c => c.type !== CardType.ATTACK);
         if (hasNonAttack) {
             addNotification("Battle Trance requires only Attacks in hand!", 'info');
             return;
         }
    }

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
        // Apply Tenacity
        if (player.effects[StatusEffect.TENACITY]) {
             block += player.effects[StatusEffect.TENACITY];
        }
        newPlayer.block += block;
        logs.push(`Gained ${block} Block`);
    }
    
    // --- HANDLE CARD EFFECT ---
    let selectionRequest = null;
    if (card.effect) {
        const result = card.effect(g, targetId, logs, card); // Fixed: Pass card as source
        if (result) {
            if (result.action === 'CRAFT') {
                setCraftingOptions(result.options);
            } else if (result.action === 'SELECT') {
                selectionRequest = result;
            }
        }
    }

    newPlayer.hand = newPlayer.hand.filter(c => c.id !== card.id);
    
    // NEW RULE: Traps Exhaust when played
    if (card.volatile || card.type === CardType.TRAP) {
        logs.push(`${card.name} burned (Exhausted)`);
    } else {
        newPlayer.discardPile.push(card);
    }

    if (card.cardClass.includes(ClassTag.HOLY) || card.cardClass.includes(ClassTag[subclass])) {
        applyStatus(newPlayer, StatusEffect.HOLY_FERVOR, 1, logs);
    }

    // Check for Enemy Death
    const deadEnemies = g.enemies.filter(e => e.currentHealth <= 0);
    if (deadEnemies.length > 0) {
        g.enemies.forEach(survivor => {
            if (survivor.currentHealth > 0 && survivor.moves.some(m => m.mechanic && m.mechanic.triggerCondition === 'OnAllyDeath')) {
                applyStatus(survivor, StatusEffect.AUGMENT, 6, logs);
                survivor.block += 6;
                logs.push(`${survivor.name} gained 6 Augment & 6 Block (Fire Ritual)`);
            }
        });
    }

    setPlayer(newPlayer);
    setSelectedCard(null);

    // --- HANDLE SELECTION UI TRIGGER ---
    if (selectionRequest) {
        // Fetch candidates based on source
        let candidates = [];
        if (selectionRequest.source === 'DISCARD') {
            candidates = newPlayer.discardPile.filter(selectionRequest.filter);
        } else if (selectionRequest.source === 'HAND') {
            candidates = newPlayer.hand.filter(selectionRequest.filter);
        }

        if (candidates.length === 0) {
            addNotification("No valid targets for selection.", 'info');
        } else if (candidates.length <= selectionRequest.count) {
            // Auto-select if not enough cards to choose
            const autoLog = [];
            selectionRequest.logic({ player: newPlayer, enemies }, candidates, autoLog);
            autoLog.forEach(l => addNotification(l, 'info'));
            setPlayer({...newPlayer}); // Re-save state after logic
        } else {
            // Open UI
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
        if (ratio <= 0.3 && !e.hasUsedLastResort && e.lastResortCooldown <= 0) {
            const lrMove = e.moves.find(m => m.category === EnemyMoveCategory.LAST_RESORT);
            if (lrMove && e.nextMove?.id !== lrMove.id) {
                 e.nextMove = lrMove;
                 e.hasUsedLastResort = true;
                 e.lastResortCooldown = lrMove.cooldown || 99;
            }
        }
    });

    setEnemies(updatedEnemies); 
    
    if (g.enemies.every(e => e.currentHealth <= 0)) {
      // Don't double deck
      setPlayer(newPlayer);
      setTimeout(() => setScreen('REWARD'), 1000);
    }
  };

  const handleSelectionComplete = () => {
      if (!cardSelection || !player) return;
      
      const selectedCards = cardSelection.candidates.filter(c => tempSelection.includes(c.id));
      const newPlayer = { ...player }; // Clone state
      const logs = [];
      
      // Run the logic defined by the card
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

    interactionLock.current = true;
    setTimeout(() => { interactionLock.current = false; }, 250);

    const newPlayer = { 
        ...player,
        hand: [...player.hand],
        discardPile: [...player.discardPile]
    };
    
    const retainedCards = newPlayer.hand.filter(c => c.retain);
    const discardedCards = newPlayer.hand.filter(c => !c.retain);

    if (subclass === 'KNIGHT') {
        const blockGain = discardedCards.length;
        if (blockGain > 0) {
            newPlayer.block += blockGain;
        }
    }

    newPlayer.discardPile.push(...discardedCards);
    newPlayer.hand = retainedCards; 
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
      
      const currentActionLogs = []; // Collect events here

      // --- DAMAGE CALCULATION BLOCK ---
      let finalDamage = move.damage || 0;
      
      if (move.statusScaling && move.statusScaling === ScalingFactor.AUGMENT) {
          finalDamage += (activeEnemy.effects[StatusEffect.AUGMENT] || 0);
      } 
      // Kobold Fanatic: Double remaining HP
      else if (move.damageScaling === ScalingFactor.CURRENT_HP) {
          finalDamage = activeEnemy.currentHealth * 2;
      }
      // Goblin Hunter: Discard Pile Size
      else if (move.damageScaling === ScalingFactor.TARGET_DISCARD_PILE_COUNT) {
          finalDamage = newPlayer.discardPile.length;
      }

      if (finalDamage > 0) {
          dealDamage({player: newPlayer, enemies: newEnemies}, activeEnemy, newPlayer, finalDamage, currentActionLogs);
      }

      // --- END DAMAGE BLOCK ---

      if (move.statusEffects) {
          move.statusEffects.forEach(eff => {
             if (eff.status === StatusEffect.BLOCK) {
                 activeEnemy.block += eff.amount;
                 currentActionLogs.push(`${activeEnemy.name} gained ${eff.amount} Block`);
             }
             // Handle Scaling for Burn (Shaman)
             else if (eff.status === StatusEffect.BURNING && move.statusScaling === ScalingFactor.AUGMENT) {
                 const amount = (activeEnemy.effects[StatusEffect.AUGMENT] || 0);
                 applyStatus(newPlayer, StatusEffect.BURNING, amount, currentActionLogs);
             }
             // Fix: Added BLOODTHIRST and RAGE to self-targeting effects
             else if (eff.status === StatusEffect.EVASION || eff.status === StatusEffect.BLOODTHIRST || eff.status === StatusEffect.RAGE) {
                 applyStatus(activeEnemy, eff.status, eff.amount, currentActionLogs);
             }
             else applyStatus(newPlayer, eff.status, eff.amount, currentActionLogs);
          });
      }
      
      // Handle Mechanic: Modify Cost (Tongue Grapple)
      if (move.mechanic && move.mechanic.modifyPlayerCost) {
          const mod = move.mechanic.modifyPlayerCost;
          newPlayer.costModifiers.push({ 
              amount: mod.amount, 
              durationTurns: mod.durationTurns, 
              cardType: mod.cardType 
          });
          currentActionLogs.push(`Player Attacks cost +${mod.amount} next turn!`);
      }

      // Handle Mechanic: Restore HP (Gobble / Lifevamp)
      if (move.mechanic && move.mechanic.restoreHp) {
          let healAmount = 0;
          if (move.mechanic.restoreHp.type === 'Fixed') healAmount = move.mechanic.restoreHp.amount || 0;
          else if (move.mechanic.restoreHp.type === 'DamageDealt') healAmount = move.damage || 0; // Simplified access to last dmg
          
          if (healAmount > 0) healUnit(activeEnemy, healAmount, currentActionLogs);
      }
      
       // Burn Cards (Gobble)
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

      // Add Card To Discard (Goblin Trap)
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

      // Handle Mechanic: Mill (Cheap Trick)
      if (move.mechanic && move.mechanic.mill) {
          const { count } = move.mechanic.mill;
          const milledCards = [];
          
          for(let i=0; i<count; i++) {
              // Reshuffle if empty
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
      
      // Self Damage (Immolation)
      if (move.mechanic && move.mechanic.dealDamageToSelf && move.mechanic.dealDamageToSelf.type === 'CurrentHP') {
            const selfDmg = activeEnemy.currentHealth;
            activeEnemy.currentHealth = 0;
            currentActionLogs.push(`${activeEnemy.name} sacrifices itself!`);
      }

      // Handle Mechanic: Execute Moves (Dragon Rage)
      if (move.mechanic && move.mechanic.executeMoves) {
          const movesToExec = move.mechanic.executeMoves; // Array of move IDs
          const extraActions = movesToExec.map(mid => {
              const moveDef = activeEnemy.moves.find(m => m.id === mid);
              return moveDef ? { enemyId: activeEnemy.id, move: moveDef } : null;
          }).filter(Boolean);

          if (extraActions.length > 0) {
              // Prepend these actions to the remaining queue
              const nextQueue = currentQueue.slice(1);
              const newQueue = [...extraActions, ...nextQueue];
              
              // We modify the queue state so that when the current action is dismissed, the extra actions are processed first
              setActionQueue(newQueue); 
              
              // IMPORTANT: We do NOT processNextAction here because we are currently IN processNextAction.
              // The UI will show the "Dragon Rage" alert. When the user clicks dismiss, `handleDismissAction` will be called.
              // However, `handleDismissAction` normally slices the *current state* queue.
              // Since we updated the state queue here, we need to make sure `handleDismissAction` works correctly.
              // But wait, `handleDismissAction` uses the state `actionQueue`. 
              
              // The standard flow is: processNextAction(queue) -> setActiveEnemyAction -> User Click Dismiss -> handleDismissAction -> processNextAction(nextQueue).
              
              // If I modify `setActionQueue` here, the `handleDismissAction` will see the new queue.
              // But `handleDismissAction` does `actionQueue.slice(1)`.
              // The current queue head is "Rage". The new queue head is "Glide".
              // So the new queue looks like: [Glide, Spit, NextEnemy].
              // BUT `handleDismissAction` assumes the head is the *finished* action (Rage).
              // So we need to keep "Rage" at the head of the state queue until dismissal.
              
              // Correct approach:
              // setActionQueue([currentQueue[0], ...extraActions, ...currentQueue.slice(1)]);
              setActionQueue([currentQueue[0], ...extraActions, ...currentQueue.slice(1)]);
          }
      }


      if (activeEnemy.lastResortCooldown > 0) activeEnemy.lastResortCooldown--;

      setPlayer(newPlayer);
      setEnemies(newEnemies.filter(e => e.currentHealth > 0)); // Filter dead enemies
      
      setActiveEnemyAction({
          enemyName: activeEnemy.name,
          moveName: move.name,
          description: move.description,
          events: currentActionLogs
      });
      // Note: We only update the queue for normal recursive calls here if we didn't modify it specially above.
      // If it's a standard move, the queue state was set at start of turn.
      // Actually, `processNextAction` is recursive and purely functional based on its argument `currentQueue`.
      // The state `actionQueue` is primarily for the UI to know what's happening or for resume?
      // Actually `handleDismissAction` uses `actionQueue` state.
      // So we must ensure `actionQueue` state matches the current reality.
      
      if (!move.mechanic?.executeMoves) {
          setActionQueue(currentQueue);
      }
  };

  const handleDismissAction = () => {
      if (activeEnemyAction && activeEnemyAction.events.length > 0) {
          activeEnemyAction.events.forEach(msg => {
              // Basic heuristics for type
              let type = 'info';
              if (msg.includes('damage')) type = 'damage';
              else if (msg.includes('Block') || msg.includes('Protection')) type = 'block';
              else if (msg.includes('Applied') || msg.includes('Enraged')) type = 'status';
              else if (msg.includes('healed')) type = 'heal';
              
              addNotification(msg, type);
          });
      }
      
      // Proceed to next action
      const nextQueue = actionQueue.slice(1);
      setActionQueue(nextQueue);
      setActiveEnemyAction(null);
      processNextAction(nextQueue, player, enemies);
  };

  const startPlayerTurn = (p, es) => {
    const newPlayer = { ...p };
    const newEnemies = [...es]; // Shallow copy

    newPlayer.block = 0;
    newPlayer.energy = newPlayer.maxEnergy;
    const drawCount = 5 + (newPlayer.effects[StatusEffect.WISDOM] || 0);
    drawCards({player: newPlayer}, drawCount);

    // --- HANDLE PASSIVE TRAP LOGIC (After Draw Phase) ---
    const bindingTraps = newPlayer.hand.filter(c => c.id.includes('binding_trap'));
    if (bindingTraps.length > 0) {
        bindingTraps.forEach(() => {
             // Find cards that are NOT the trap itself (to prevent trap eating trap loops for now, or just random)
             const discardableIndices = newPlayer.hand.map((c, i) => i).filter(i => !newPlayer.hand[i].id.includes('binding_trap'));
             
             if (discardableIndices.length > 0) {
                 const randIdx = discardableIndices[Math.floor(Math.random() * discardableIndices.length)];
                 const discarded = newPlayer.hand.splice(randIdx, 1)[0];
                 newPlayer.discardPile.push(discarded);
                 addNotification(`Binding Trap discarded ${discarded.name}!`, 'damage');
             }
        });
    }
    // --- END PASSIVE TRAP LOGIC ---
    
    // RECKLESS NATURE LOGIC
    if (newPlayer.effects[StatusEffect.RECKLESS] && newPlayer.hand.length > 0) {
        // Find first card
        const cardToPlay = newPlayer.hand[0];
        const baseCost = getCardCost(cardToPlay, newPlayer);
        // Reduced by 1, min 0
        const reducedCost = Math.max(0, baseCost - 1);
        
        // Check if affordable
        if (newPlayer.energy >= reducedCost) {
             newPlayer.energy -= reducedCost;
             const logs = [`Reckless Nature played ${cardToPlay.name}`];
             
             // Simple play logic simulation (only Damage & Status for now to avoid complexity)
             const g = { player: newPlayer, enemies: newEnemies };
             
             // Handle Effects
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
                 cardToPlay.effect(g, undefined, logs, cardToPlay); // Fixed: Passed cardToPlay as source (4th arg)
             }

             // Move to discard
             newPlayer.hand.shift(); // Remove first element
             newPlayer.discardPile.push(cardToPlay);
             
             logs.forEach(l => addNotification(l, 'info'));
        }
    }

    // Update Cost Modifiers
    newPlayer.costModifiers = newPlayer.costModifiers
        .map(mod => ({ ...mod, durationTurns: mod.durationTurns - 1 }))
        .filter(mod => mod.durationTurns >= 0); 
    
    [newPlayer, ...newEnemies].forEach(u => {
        if (u.effects[StatusEffect.BURN]) {
            u.currentHealth -= u.effects[StatusEffect.BURN];
            u.effects[StatusEffect.BURN]--;
            if(u.effects[StatusEffect.BURN] <= 0) delete u.effects[StatusEffect.BURN];
        }
        if (u.effects[StatusEffect.BLEED]) {
            u.currentHealth -= u.effects[StatusEffect.BLEED];
        }
    });

    // Check for victory immediately after start-of-turn effects (Reckless, Burn, Bleed)
    if (newEnemies.every(e => e.currentHealth <= 0)) {
        setPlayer(newPlayer);
        setEnemies(newEnemies);
        setTimeout(() => setScreen('REWARD'), 1000);
        return;
    }

    // Filter out dead enemies so they don't act or display with negative HP
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
          {/* Head */}
          <div className="flex items-start gap-4 bg-slate-800 p-4 rounded w-full max-w-sm border border-slate-700">
            <div className="flex-shrink-0"><User className="mt-1 text-yellow-500" /></div>
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">HEAD</div>
                <div className="font-bold text-lg">{loadout.head.name}</div>
                <div className="text-xs text-slate-300 mt-1"><KeywordText text={loadout.head.desc} /></div>
            </div>
          </div>
          {/* Body */}
          <div className="flex items-start gap-4 bg-slate-800 p-4 rounded w-full max-w-sm border border-slate-700">
            <div className="flex-shrink-0"><ShirtIcon className="mt-1 text-yellow-500" /></div>
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">BODY</div>
                <div className="font-bold text-lg">{loadout.body.name}</div>
                <div className="text-xs text-slate-300 mt-1"><KeywordText text={loadout.body.desc} /></div>
            </div>
          </div>
          {/* Main Hand */}
          <div className="flex items-start gap-4 bg-slate-800 p-4 rounded w-full max-w-sm border border-slate-700">
            <div className="flex-shrink-0"><Sword className="mt-1 text-yellow-500" /></div>
            <div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">MAIN HAND</div>
                <div className="font-bold text-lg">{loadout.main.name}</div>
                <div className="text-xs text-slate-300 mt-1"><KeywordText text={loadout.main.desc} /></div>
            </div>
          </div>
          {/* Off Hand */}
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
    // Define Options
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
          onClick={startGame} 
          className="fixed bottom-6 right-6 z-50 md:absolute md:top-8 md:right-8 md:bottom-auto px-6 py-3 md:px-8 md:py-3 bg-green-700 hover:bg-green-600 disabled:bg-slate-700 disabled:cursor-not-allowed rounded font-bold text-lg shadow-lg flex items-center gap-2 transition-all"
        >
          Embark <ArrowRight size={20} />
        </button>

        <h2 className="text-3xl font-serif mb-2 mt-4 md:mt-0 text-center">Draft Starting Deck</h2>
        <p className="text-slate-400 mb-8 md:mb-12 text-center">Base Attack (x6 Strike) included automatically.</p>
        
        <div className="flex flex-col gap-12 w-full max-w-5xl justify-center items-center pb-24 md:pb-0">
          
          {/* Skills Row */}
          <div className="w-full">
            <h3 className="text-center font-bold text-blue-400 uppercase tracking-widest text-sm mb-6">Select Innate Skill (x3)</h3>
            <div className="flex justify-center gap-6">
                {draftSkills.map(card => (
                  <div key={card.id} className="cursor-pointer hover:scale-105 transition-transform" onClick={() => setDraftSelections(prev => ({...prev, skill: card}))}>
                      <CardView card={card} selected={draftSelections.skill?.id === card.id} />
                  </div>
                ))}
            </div>
          </div>

          {/* Powers Row */}
          <div className="w-full">
            <h3 className="text-center font-bold text-yellow-400 uppercase tracking-widest text-sm mb-6">Select Innate Power (x1)</h3>
             <div className="flex justify-center gap-6">
                {draftPowers.map(card => (
                  <div key={card.id} className="cursor-pointer hover:scale-105 transition-transform" onClick={() => setDraftSelections(prev => ({...prev, power: card}))}>
                      <CardView card={card} selected={draftSelections.power?.id === card.id} />
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (screen === 'COMBAT') {
    return (
      <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden relative">
        
        {/* NOTIFICATION CONTAINER */}
        <div className="absolute top-20 right-4 flex flex-col gap-2 z-50 pointer-events-none items-end">
            {/* Clear Button */}
            {notifications.length > 0 && (
                <button 
                    onClick={() => setNotifications([])} 
                    className="pointer-events-auto mb-1 px-3 py-1 bg-slate-800 hover:bg-red-900 border border-slate-600 text-slate-300 hover:text-white rounded text-xs font-bold flex items-center gap-1 shadow-lg transition-colors"
                >
                    <Trash2 size={12} /> Clear All
                </button>
            )}
            
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

        {/* PILE VIEW MODAL */}
        {viewingPile !== null && (
            <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in p-8">
                <div className="w-full max-w-5xl h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-serif text-yellow-500">{viewingPile.title} ({viewingPile.cards.length})</h2>
                        <button onClick={() => setViewingPile(null)}><X className="text-slate-400 hover:text-white" size={32}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 border border-slate-700 rounded bg-slate-900/50 justify-items-center">
                        {viewingPile.cards.map((c, i) => (
                             <div key={i} className="scale-90 origin-top"><CardView card={c} playable={false} /></div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* EQUIPMENT MODAL */}
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
                                    {item.slot === EquipmentSlot.HEAD ? <User className="text-blue-400" /> : 
                                     item.slot === EquipmentSlot.BODY ? <ShirtIcon className="text-blue-400" /> :
                                     item.slot === EquipmentSlot.RIGHT_HAND ? <Sword className="text-red-400" /> : <Shield className="text-green-400" />}
                                    <div>
                                        <div className="font-bold text-sm md:text-base">{item.name}</div>
                                        <div className="text-[10px] md:text-xs text-slate-400 mt-1"><KeywordText text={item.desc} /></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )}

        {/* CRAFTING OVERLAY */}
        {craftingOptions && (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-fade-in p-4">
                <h2 className="text-2xl md:text-4xl font-serif text-yellow-400 mb-8 text-center">Craft A Blessing</h2>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                    {craftingOptions.map(card => (
                        <div key={card.id} onClick={() => handleCraftSelection(card)} className="cursor-pointer hover:scale-110 transition-transform scale-90 md:scale-100">
                            <CardView card={card} />
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* CARD SELECTION OVERLAY */}
        {cardSelection && (
            <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in p-8">
                <div className="w-full max-w-5xl flex flex-col items-center">
                    <h2 className="text-2xl md:text-4xl font-serif text-yellow-400 mb-4 text-center">{cardSelection.title}</h2>
                    <p className="text-slate-400 mb-8 text-center">Select {cardSelection.count} {cardSelection.count === 1 ? 'card' : 'cards'}. ({tempSelection.length}/{cardSelection.count})</p>
                    
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

        {/* Header */}
        <div className="h-14 md:h-16 bg-slate-900 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-2">
          <div className="font-bold text-sm md:text-xl text-center md:text-left w-full md:w-auto">The Forest - Step {step}/10</div>
          <div className="flex gap-4 text-xs md:text-sm text-slate-400 mt-1 md:mt-0">
             <div className="font-mono">TURN {turn}</div>
          </div>
        </div>

        {/* Battlefield */}
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Enemies */}
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl">
            {enemies.map((enemy, idx) => (
              <div key={idx} onClick={() => selectedCard && selectedCard.target === CardTarget.SINGLE && playCard(selectedCard, enemy.id)} className={`relative transition-all ${selectedCard && selectedCard.target === CardTarget.SINGLE ? 'cursor-crosshair hover:scale-105 ring-2 ring-red-500 rounded-lg' : ''}`}>
                <div className="w-24 h-36 md:w-32 md:h-48 bg-red-900 rounded-lg border-2 md:border-4 border-red-700 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(185,28,28,0.2)] relative group">
                  <div className="absolute top-1 right-1 md:top-2 md:right-2 cursor-help z-20"><Info size={14} className="text-red-300 hover:text-white" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black border border-red-500 rounded text-xs text-white hidden group-hover:block z-50 shadow-xl">
                        {enemy.description}
                    </div>
                  </div>
                  <Skull className="w-8 h-8 md:w-12 md:h-12" />
                  <div className="font-bold mt-1 md:mt-2 text-center leading-tight text-[10px] md:text-base px-1">{enemy.name}</div>
                  <div className="text-[8px] md:text-xs text-red-300">{enemy.grade}-Tier</div>
                  {/* HP Bar */}
                  <div className="w-full px-2 mt-1 md:mt-2">
                    <div className="h-1.5 md:h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 transition-all" style={{width: `${(enemy.currentHealth / enemy.maxHealth) * 100}%`}}></div>
                    </div>
                    <div className="text-[8px] md:text-xs text-center mt-0.5 md:mt-1">{enemy.currentHealth}/{enemy.maxHealth}</div>
                    {/* Block */}
                    {enemy.block > 0 && <div className="text-center text-[8px] md:text-[10px] text-blue-300 font-bold">Block: {enemy.block}</div>}
                  </div>
                </div>
                {/* Statuses */}
                <div className="flex gap-0.5 md:gap-1 mt-1 justify-center flex-wrap max-w-[96px] md:max-w-[150px]">
                    {Object.entries(enemy.effects).map(([k, v]) => (
                        <div key={k} className="bg-slate-800 px-1 rounded text-[8px] md:text-[10px] border border-slate-600 cursor-help" title={KEYWORDS[k] || k}>{k.substring(0,2)}:{v}</div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player HUD & Hand Area */}
        <div className="bg-slate-900 border-t border-slate-800 relative flex flex-col items-center">
          
          {/* HUD Bar */}
          <div className="w-full bg-slate-800 border-b border-slate-700 px-2 md:px-8 py-2 flex items-center justify-between h-14 md:h-auto">
             {/* Player Stats */}
             <div className="flex items-center gap-2 md:gap-6 flex-1">
                {/* Health */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="hidden md:block text-sm text-slate-400">Health</div>
                    <div className="text-sm md:text-xl font-bold text-red-400 flex items-center gap-1 md:gap-2">
                        <Heart className="fill-red-500 w-4 h-4 md:w-5 md:h-5"/> {player?.currentHealth}
                    </div>
                </div>

                {/* Energy */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="hidden md:block text-sm text-slate-400">Energy</div>
                    <div className="text-sm md:text-xl font-bold text-yellow-400 flex items-center gap-1 md:gap-2">
                        <Zap className="fill-yellow-500 w-4 h-4 md:w-5 md:h-5"/> {player?.energy}/{player?.maxEnergy}
                    </div>
                </div>

                {/* Block */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="hidden md:block text-sm text-slate-400">Block</div>
                    <div className="text-sm md:text-xl font-bold text-blue-400 flex items-center gap-1 md:gap-2">
                        <Shield className="fill-blue-500 w-4 h-4 md:w-5 md:h-5"/> {player?.block}
                    </div>
                </div>
                
                {/* Status Effects - Simplified for Mobile */}
                <div className="flex gap-1 flex-wrap max-w-[120px] md:max-w-md ml-2">
                    {Object.entries(player.effects).map(([k, v]) => (
                        <div key={k} className="bg-slate-950 px-1.5 py-0.5 rounded text-[10px] md:text-xs border border-slate-600 text-yellow-500 font-mono cursor-help relative group">
                            {k.substring(0,2)}:{v}
                            <span className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-black border border-slate-500 rounded hidden group-hover:block z-50 text-white normal-case font-sans">
                                {KEYWORDS[k] || k}
                            </span>
                        </div>
                    ))}
                </div>
             </div>
             
             {/* Deck Info & End Turn */}
             <div className="flex items-center gap-3 md:gap-6 text-slate-400 text-xs md:text-sm font-mono">
                <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors" onClick={() => setShowEquipment(true)}>
                    <Package size={16} className="md:w-5 md:h-5"/>
                    <span className="hidden md:inline">Equip</span>
                </div>
                <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors" onClick={openDrawPile}>
                    <Layers size={16} className="md:w-5 md:h-5"/>
                    <span className="hidden md:inline">Draw: {player?.drawPile.length}</span>
                    <span className="md:hidden">{player?.drawPile.length}</span>
                </div>
                <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors" onClick={openDiscardPile}>
                    <RefreshCw size={16} className="md:w-5 md:h-5"/>
                    <span className="hidden md:inline">Discard: {player?.discardPile.length}</span>
                    <span className="md:hidden">{player?.discardPile.length}</span>
                </div>

                {/* End Turn Button (Moved Here) */}
                <button 
                    onClick={startEnemyPhase} 
                    className="ml-2 bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg shadow-lg border-2 border-red-400 hover:scale-105 transition-transform flex items-center justify-center"
                    title="End Turn"
                >
                    <ArrowRight size={20} />
                </button>
             </div>
          </div>

          {/* Floating Energy Orb Removed (already handled) */}
          {/* Old Floating End Turn Button Removed */}

          {/* Hand Cards Container */}
          <div className="w-full h-48 md:h-64 overflow-x-auto overflow-y-hidden pb-4 pt-8 px-4">
            <div className="flex justify-start md:justify-center items-end gap-2 md:gap-4 min-w-max mx-auto">
                {player?.hand.map((card, idx) => (
                <div key={idx} onClick={() => card.target === CardTarget.SINGLE ? setSelectedCard(selectedCard === card ? null : card) : playCard(card)} 
                    className={`flex-shrink-0 transform transition-all duration-200 hover:-translate-y-8 md:hover:-translate-y-12 hover:scale-105 z-0 hover:z-10 ${selectedCard === card ? '-translate-y-8 md:-translate-y-12 ring-4 ring-yellow-400 rounded-xl z-10' : ''} ${player?.costModifiers.some(m => !m.cardType || m.cardType === card.type) ? 'ring-2 ring-red-500' : ''}`}>
                    <CardView card={card} playable={
                      // Check playability
                      (() => {
                        if (player.energy < getCardCost(card, player)) return false;
                        if (card.name === 'Battle Trance') {
                             const otherCards = player.hand.filter(c => c.id !== card.id);
                             return otherCards.every(c => c.type === CardType.ATTACK);
                        }
                        return true;
                      })()
                    } costDisplay={getCardCost(card, player)} />
                </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'REWARD') {
    // Generate Rewards
    // Fix: Filter out "Strike" from the reward pool so players get new cards
    const rewardPool = COMMON_CRUSADER_CARDS.filter(c => c.id !== 'strike');
    
    const common = rewardPool[Math.floor(Math.random() * rewardPool.length)];
    const common2 = rewardPool[Math.floor(Math.random() * rewardPool.length)];
    const subPool = subclass === 'KNIGHT' ? KNIGHT_CARDS : subclass === 'ZEALOT' ? ZEALOT_CARDS : INQUISITOR_CARDS;
    const sub = subPool[Math.floor(Math.random() * subPool.length)];
    const rewards = [common, common2, sub];

    const pickReward = (card) => {
        // Fixed: Generate unique ID for the new card
        const newCard = { ...card, id: `${card.id}_${Date.now()}` };
        const newDeck = [...deck, newCard];
        setDeck(newDeck);
        // Heal using healUnit (removed fixed heal)
        startEncounter(step + 1);
    };

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <h2 className="text-4xl font-bold text-yellow-500 mb-4">Victory!</h2>
        <p className="mb-8 text-slate-400">Choose a card to add to your deck</p>
        <div className="flex gap-8">
            {rewards.map((c, i) => (
                <div key={i} onClick={() => pickReward(c)} className="cursor-pointer hover:scale-105 transition-transform">
                    <CardView card={c} />
                </div>
            ))}
        </div>
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
  // Helper to split text and wrap keywords
  const parts = text.split(/(\b(?:Block|Vulnerable|Weak|Strength|Bleed|Poison|Burn|Evasion|Holy Fervor|Stun|Confusion|Tenacity|Protection|Innate|Volatile|Retain|Ranged|Exhaust|Mill|Augment|Dispel|Thorns|Rage|Bloodthirst|Entangled|Blighted|Lifevamp|Regen|Gestating|Debuff|Reckless|Weapon Mastery)\b)/gi);
  
  return (
    <span>
      {parts.map((part, i) => {
        // Normalize key lookup
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

const CardView = ({ card, selected, playable = true, costDisplay, onClick }) => {
  const border = card.rarity === CardRarity.COMMON ? 'border-slate-400' : card.rarity === CardRarity.TOKEN ? 'border-yellow-200' : 'border-purple-500';
  const displayCost = costDisplay !== undefined ? costDisplay : card.cost;
  const costColor = displayCost > card.cost ? 'text-red-500' : displayCost < card.cost ? 'text-green-400' : 'text-white';

  return (
    <div 
      onClick={onClick}
      className={`w-24 h-36 md:w-32 md:h-48 bg-slate-800 rounded-xl border-2 ${border} p-2 md:p-3 flex flex-col relative shadow-xl ${!playable ? 'opacity-50 grayscale' : ''} ${selected ? 'ring-4 ring-yellow-400' : ''}`}
    >
      {/* Cost */}
      <div className={`absolute -top-2 -left-2 md:-top-3 md:-left-3 w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded-full flex items-center justify-center font-bold border-2 border-white z-10 text-xs md:text-sm ${costColor}`}>
        {displayCost}
      </div>
      
      {/* Title */}
      <div className="text-center font-bold text-[10px] md:text-xs mb-1 md:mb-2 pt-1 leading-none min-h-[20px]">{card.name}</div>
      
      {/* Image Placeholder */}
      <div className="flex-1 bg-slate-700 rounded mb-1 md:mb-2 flex items-center justify-center text-slate-500">
        {card.type === CardType.ATTACK ? <Sword className="w-4 h-4 md:w-5 md:h-5" /> : card.type === CardType.SKILL ? <Zap className="w-4 h-4 md:w-5 md:h-5" /> : card.type === CardType.TRAP ? <Anchor className="w-4 h-4 md:w-5 md:h-5" /> : <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />}
      </div>
      
      {/* Description - REMOVED overflow-hidden */}
      <div className="text-[8px] md:text-[10px] text-center text-slate-300 leading-tight h-8 md:h-12 relative">
        <KeywordText text={card.description} />
      </div>

      {/* Classes */}
      <div className="flex justify-center gap-1 flex-wrap mb-1 px-1">
          {card.cardClass?.map((c, i) => (
              <span key={i} className="text-[6px] uppercase font-bold text-slate-400 bg-slate-900/50 px-1 rounded">
                  {c}
              </span>
          ))}
      </div>
      
      {/* Footer */}
      <div className="mt-auto pt-1 text-[6px] md:text-[8px] text-center text-slate-500 font-mono uppercase truncate">
        {card.type} - {card.rarity}
      </div>
    </div>
  );
};

function ShirtIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
}