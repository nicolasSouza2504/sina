package senai.com.ava_senai.domain.user.address;

import jakarta.persistence.*;
import lombok.Data;
import senai.com.ava_senai.domain.DefaultEntity;

@Data
@Entity
@Table(name = "address")
public class Address extends DefaultEntity {

    private String country;
    private String state;
    private String city;
    private String neighborhood;
    private String street;
    private String number;
    private String complement;
    private String zipCode;

}
