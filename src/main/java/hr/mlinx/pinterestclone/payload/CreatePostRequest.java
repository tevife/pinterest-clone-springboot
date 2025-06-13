package hr.mlinx.pinterestclone.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class CreatePostRequest {

    @URL
    @NotBlank
    private String imageUrl;

    @Size(max = 100)
    @NotNull
    private String description;

}
