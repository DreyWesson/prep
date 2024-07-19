#pragma once

#include "ASpell.hpp"

class Fwoosh : public ASpell {
private:

protected:

public:
    Fwoosh();
    ~Fwoosh();
    virtual ASpell *clone() const;
};