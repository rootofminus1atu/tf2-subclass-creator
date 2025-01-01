# TF2SC Backend

## Entities
1. Weapon - a weapon
    - name
    - stock - whether it's a stock weapon (stock weapons are the default weapons, they're displayed first)
    - item_slot - primary | seconday | melee
    - image_url
    - image_url_large
    - used_by_classes - list of mercenaries that can use this weapon, if not present everyone can use it
    - per_class_loadout_slots - obj containig kv pairs describing which item slot a weapon belongs to, depending on the mercenary wielding it
2. Loadout - the custom character create by the user
    - merc - Scout | Soldier | Pyro | Demoman | Heavy | Engineer | Medic | Sniper | Spy
    - primary - the primary weapon slot
    - secondary - the secondary weapon slot
    - melee - the melee weapon slot
    - name

## Endpoints
- GET /weapons?merc={merc}&slot={slot}
- GET /weapons/:id     

- GET /loadouts (with optional query param filters (in the future))
- GET /loadouts/:id
- POST /loadouts
- DELETE /loadouts/:id
- PUT /loadouts/:id