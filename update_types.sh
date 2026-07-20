#!/bin/bash
sed -i "s/export type FormType = 'PAN_CARD'/export type FormType = 'PAN_CARD' | 'PAN_CARD_CORRECTION' | 'MINOR_PAN_CARD' /" src/types.ts
sed -i "s/| 'VOTER_ID' /| 'VOTER_ID' | 'VOTER_ID_CORRECTION' /" src/types.ts
