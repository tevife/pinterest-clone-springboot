package hr.mlinx.pinterestclone.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangeUsernameRequest {

    @NotBlank
    @Size(max = 39)
    private String username;

}
