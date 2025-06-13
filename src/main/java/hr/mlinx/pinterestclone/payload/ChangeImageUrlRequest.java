package hr.mlinx.pinterestclone.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class ChangeImageUrlRequest {

    @URL
    @NotBlank
    private String imageUrl;

}
