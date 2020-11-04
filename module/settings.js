
export const registerSettings = function () {
    game.settings.register("fxmaster", "enable", {
        name: game.i18n.localize("FXMASTER.Enable"),
        default: true,
        scope: "client",
        type: Boolean,
        config: true,
        onChange: _ => window.location.reload()
    });
}