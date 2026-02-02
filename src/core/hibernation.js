export function nbrCosmiquesAchetes(cosmiques, quantiteCosmique) {
    let count = 0;

    for (const c of cosmiques) {
        if ((quantiteCosmique?.[c.id] ?? 0) >= 1) {
            count++;
        }
    }

    return count;
}

export function verifierHibernation(cosmiques, quantiteCosmique) {
    const nb = nbrCosmiquesAchetes(cosmiques, quantiteCosmique);

    if (nb < 1) {
        alert("Vous ne pouvez pas hiberner");
        return false;
    }

    if (nb < 3) {
        alert("Il vous faut au moins 3 cosmiques pour hiberner");
        return false;
    }

    alert("Vous pouvez maintenant hiberner");
    return true;
}
