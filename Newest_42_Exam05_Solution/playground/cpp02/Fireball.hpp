#pragma once

#include "ASpell.hpp"

class Fireball : public ASpell {
private:

protected:

public:
    Fireball();
    ~Fireball();
    ASpell *clone() const;
};
