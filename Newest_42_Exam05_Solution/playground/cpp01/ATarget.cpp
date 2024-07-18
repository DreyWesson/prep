#include "ATarget.hpp"
#include "ASpell.hpp"

ATarget::ATarget(const std::string &type_) :
type(type_) {

}

ATarget::ATarget(const ATarget &src) : type(src.type) {
}

ATarget &ATarget::operator=(const ATarget &src) {
    if (this != &src) {
        this->type = src.type;
    }
    return *this;
}

ATarget::~ATarget() {
    
}

void ATarget::setType(const std::string &type_)
{
    type = type_;
}


const std::string &ATarget::getType(void) const
{
    return type;
}

void ATarget::getHitBySpell(const ASpell &spell) const {
    std::cout << type << " has been " << spell.getEffects() << "!" << std::endl;
}
