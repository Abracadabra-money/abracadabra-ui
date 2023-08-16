import { spellConfig } from "@/utils/stake/spellConfig";
import type {
  SpellInfo,
  SSpellInfo,
  MSpellInfo,
} from "@/helpers/stake/spell/types";

export const spellEmptyState: SpellInfo = {
  name: spellConfig.spell.name,
  icon: spellConfig.spell.icon,
  balance: "0",
  price: 1,
};

export const sSpellEmptyState: SSpellInfo = {
  name: spellConfig.sSpell.name,
  icon: spellConfig.sSpell.icon,
  rate: 1,
  lockTimestamp: "0",
  contract: null,
  balance: "0",
  allowanceAmount: "0",
  unsupportedChain: true,
  price: 1,
};

export const mSpellEmptyState: MSpellInfo = {
  name: spellConfig.mSpell.name,
  icon: spellConfig.mSpell.icon,
  rate: 1,
  lockTimestamp: "0",
  contract: null,
  balance: "0",
  claimableAmount: "0",
  allowanceAmount: "0",
  unsupportedChain: true,
  price: 1,
};
