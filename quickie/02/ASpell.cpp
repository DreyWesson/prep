#include "ASpell.hpp"
#include "ATarget.hpp"

ASpell::ASpell(const std::string &name_, const std::string &effects_) : name(name_), effects(effects_) {

}

ASpell::ASpell(const ASpell &src) : name(src.name), effects(src.effects) {
}

ASpell &ASpell::operator=(const ASpell &src) {
    if (this != &src) {
        this->name = src.name;
        this->effects = src.effects;
    }
    return *this;
}

ASpell::~ASpell() {

}

const std::string &ASpell::getName(void) const {
    return name;
}

const std::string &ASpell::getEffects(void) const {
    return effects;
}


void ASpell::setName(const std::string &name_) {
    name = name_;
}

void ASpell::setEffects(const std::string &effects_) {
    effects = effects_;
}

void ASpell::launch(const ATarget &target) const {
    target.getHitBySpell(*this);
}
