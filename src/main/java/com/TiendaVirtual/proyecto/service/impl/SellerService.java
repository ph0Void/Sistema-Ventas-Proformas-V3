package com.TiendaVirtual.proyecto.service.impl;

import com.TiendaVirtual.proyecto.persistence.model.Seller;
import com.TiendaVirtual.proyecto.persistence.model.auth.Role;
import com.TiendaVirtual.proyecto.persistence.model.auth.User;
import com.TiendaVirtual.proyecto.persistence.repository.SellerRepository;
import com.TiendaVirtual.proyecto.persistence.repository.UserRepository;
import com.TiendaVirtual.proyecto.presentation.dto.req.SellerReqDto;
import com.TiendaVirtual.proyecto.presentation.dto.res.SellerDto;
import com.TiendaVirtual.proyecto.service.ISellerService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SellerService implements ISellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;

    private final Logger logger = LoggerFactory.getLogger(SellerService.class);

    @Override
    public List<SellerDto> findAll() {
        List<Seller> sellers = (List<Seller>) sellerRepository.findAll();
        return sellers.stream().map(seller -> {
            SellerDto sellerDto = new SellerDto();
            BeanUtils.copyProperties(seller, sellerDto);
            return sellerDto;
        }).toList();
    }

    @Override
    public Optional<Seller> findByUserId(Long userId) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No existe vendedor asociado al usuario con id: " + userId));
        return Optional.of(seller);
    }

    @Override
    public Optional<SellerDto> findById(Long id) {
        SellerDto sellerNew = new SellerDto();
        return sellerRepository.findById(id)
                .map(seller -> {
                    BeanUtils.copyProperties(seller, sellerNew);
                    return sellerNew;
                });
    }

    @Override
    @Transactional
    public SellerDto save(SellerReqDto dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> {
            logger.error("No existe usuario con id: {}", userId);
            return new IllegalArgumentException("No existe usuario con id: " + userId);
        });

        if (sellerRepository.findByCarnet(dto.getCarnet()).isPresent()){
            throw new IllegalArgumentException("Ya existe un vendedor con el carnet: " + dto.getCarnet());
        }
        // cambio de rol de usuario a vendedor
        user.setRole(Role.SELLER);
        userRepository.save(user);

        Seller seller = new Seller();
        seller.setUser(user);
        BeanUtils.copyProperties(dto, seller, "id", "user");
        seller = sellerRepository.save(seller);

        SellerDto sellerDto = new SellerDto();
        BeanUtils.copyProperties(seller, sellerDto);
        return sellerDto;
    }

    @Override
    @Transactional
    public SellerDto update(Long idSeller, SellerReqDto dto) {
        Optional<Seller> sellerOp = sellerRepository.findById(idSeller);
        if (!sellerOp.isPresent()) {
            throw new IllegalArgumentException("No existe vendedor con id: " + idSeller);
        }

        Seller seller = sellerOp.get();
        BeanUtils.copyProperties(dto, seller, "id");
        seller = sellerRepository.save(seller);

        SellerDto sellerDto = new SellerDto();
        BeanUtils.copyProperties(seller, sellerDto);
        return sellerDto;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!sellerRepository.findById(id).isPresent()) {
            throw new IllegalArgumentException("No existe vendedor con id: " + id);
        }
        sellerRepository.deleteById(id);
    }
}
