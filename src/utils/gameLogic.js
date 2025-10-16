export const calculateQuestReward = difficulty => {
    const rewards = {
        easy: { experience: 10, gold: 5 },
        medium: { experience: 25, gold: 15 },
        hard: { experience: 50, gold: 25 }
    };

    return rewards[difficulty] || rewards.easy;
};

export const calculateLevelUp = user => {
    const expNeeded = user.level * 100;

    if (user.experience >= expNeeded) {
        return {
            ...user,
            level: user.level + 1,
            experience: user.experience - expNeeded,
            maxHealth: user.maxHealth + 20,
            health: user.maxHealth + 20,
            gold: user.gold + 50
        };
    }

    return user;
};

export const canLevelUp = user => {
    return user.experience >= user.level * 100;
};
