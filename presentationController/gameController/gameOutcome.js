function win(player) {
    return {
        endMessage: () => `${player.getName()} wins!`,
    };
}
function tie() {
    return {
        endMessage: () => "Tie game!",
    };
}
export { win, tie };
//# sourceMappingURL=gameOutcome.js.map