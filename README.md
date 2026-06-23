# Magic RPG - Turn-Based Combat Adventure

A full-stack web-based RPG game built with Next.js 16, featuring turn-based combat, spell casting, and character progression.

## Features

### ✨ Core Gameplay
- **Character Creation**: Create and customize characters with multiple spell options
- **Turn-Based Combat**: Strategic real-time battles against AI-controlled enemies
- **Spell System**: 6 diverse spells across multiple elements (fire, ice, lightning, nature, holy, dark)
- **Dynamic AI**: Enemy AI adapts strategy based on health and available resources
- **Character Progression**: Gain experience and level up after battles

### 🎮 Game Mechanics
- **Combat System**:
  - Attack, Defend, and Spell actions
  - Critical hit chance based on character stats
  - Mana management for spell casting
  - Health and Mana recovery mechanics

- **Character Stats**:
  - Health (HP) and Mana (MP)
  - Attack and Defense values
  - Speed determining turn order
  - Critical chance for bonus damage

- **5 Enemy Types**:
  - Goblin (Level 1) - 50 XP reward
  - Skeleton Knight (Level 2) - 100 XP reward
  - Fire Elemental (Level 3) - 150 XP reward
  - Ice Wizard (Level 3) - 140 XP reward
  - Shadow Beast (Level 4) - 200 XP reward

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **State Management**: React hooks and server actions

### Backend
- **Runtime**: Node.js (Next.js)
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth with email/password
- **Session Management**: Secure cookie-based sessions

### Database Schema
- **users**: Better Auth user table
- **sessions**: Better Auth session management
- **characters**: Player RPG characters
- **spells**: Spell definitions
- **character_spells**: Character-to-spell associations
- **enemies**: Enemy definitions
- **battles**: Battle history and results

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Neon PostgreSQL account

### Environment Variables
Create a `.env.local` file:

```
DATABASE_URL=postgresql://user:password@host/dbname
BETTER_AUTH_SECRET=your-random-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

Generate a random secret:
```bash
openssl rand -base64 32
```

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/magic-rpg-programs.git
cd magic-rpg-programs
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy example env file and update with your values
cp .env.example .env.local
```

4. Run the development server
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Project Structure

```
app/
├── page.tsx                      # Home (character dashboard)
├── sign-in/page.tsx              # Sign-in page
├── sign-up/page.tsx              # Sign-up page
├── create-character/page.tsx      # Character creation
├── game/[characterId]/page.tsx    # Battle arena
├── api/
│   └── auth/[...all]/route.ts    # Better Auth endpoints
├── actions/
│   ├── auth.ts                   # Authentication actions
│   ├── characters.ts             # Character management
│   ├── spells.ts                 # Spell queries
│   ├── enemies.ts                # Enemy queries
│   └── battles.ts                # Battle mechanics
└── globals.css

components/
├── auth-form.tsx                 # Sign-in/Sign-up form
├── character-creation.tsx        # Character creator
├── character-selection.tsx       # Character dashboard
├── battle-arena.tsx              # Main battle interface
├── battle-display.tsx            # Battle UI (HP/Mana bars)
├── battle-log.tsx                # Combat log
└── spell-selector.tsx            # Spell selection UI

lib/
├── auth.ts                       # Better Auth configuration
├── auth-client.ts                # Auth client
├── combat.ts                     # Combat engine logic
└── db/
    ├── index.ts                  # Drizzle setup
    └── schema.ts                 # Database schema

public/                           # Static assets
```

## Game Flow

1. **Authentication**: Sign up or sign in with email/password
2. **Character Management**: View existing characters or create new ones
3. **Spell Selection**: Choose up to 4 spells when creating a character
4. **Battle Arena**: Select an enemy and engage in turn-based combat
5. **Combat**: Execute actions (attack, defend, cast spells)
6. **Results**: View battle outcome, gains experience, and level up

## Combat Mechanics

### Damage Calculation
```
Base Damage = Power + Attacker.Attack - (Defender.Defense / 2)
If Critical Hit: Damage × 1.5
Final Damage = max(1, floor(damage))
```

### Turn Order
Turn order is determined by Speed stat + random variance (-2 to +2)

### Spell Effects
- **Attack Spells**: Deal damage based on spell power and character attack
- **Heal Spells**: Restore health to the caster
- **Buff Spells**: Boost character performance (planned for future)
- **Debuff Spells**: Weaken enemies (planned for future)

### Enemy AI
- If health > 30%: Attack
- If health < 30% and mana > 15: Heal self
- Otherwise: Attack

## Spells Available

| Spell | Type | Element | Mana | Power | Effect |
|-------|------|---------|------|-------|--------|
| Fireball | Attack | Fire | 20 | 35 | Launches fire at enemy |
| Frostbolt | Attack | Ice | 18 | 30 | Fires ice bolt |
| Lightning Strike | Attack | Lightning | 25 | 40 | Electric attack |
| Heal | Heal | Holy | 15 | 25 | Restore health |
| Power Surge | Buff | Lightning | 12 | 0 | Boost attack |
| Dark Curse | Debuff | Dark | 10 | 0 | Weaken enemy |

## Future Enhancements

- [ ] Equipment system (armor, weapons)
- [ ] Item inventory and consumables
- [ ] Multiplayer PvP battles
- [ ] Dungeon exploration
- [ ] Quest system
- [ ] Leaderboards
- [ ] Multiple character classes
- [ ] Advanced spell combos
- [ ] Boss battles
- [ ] Mobile-responsive UI improvements

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Code Quality
```bash
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

```bash
vercel deploy
```

### Environment Variables on Vercel
Add to Vercel project settings:
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` (set to your production domain)

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please open an issue on GitHub.

## Credits

Built with:
- Next.js 16
- Tailwind CSS
- Drizzle ORM
- Better Auth
- Neon PostgreSQL
