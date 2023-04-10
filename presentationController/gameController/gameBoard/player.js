export default function makePlayer(name, mark) {
    function getName() {
        return name;
    }
    function getMark() {
        return mark;
    }
    return { getName, getMark };
}
//# sourceMappingURL=player.js.map